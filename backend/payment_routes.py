"""
Payment API Routes for Razorpay and Cashfree Integration
"""
import os
import hmac
import hashlib
import razorpay
from cashfree_pg import Cashfree
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import secrets

payment_bp = Blueprint('payment', __name__)

# Initialize Razorpay
RAZORPAY_KEY_ID = os.getenv('VITE_RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')

if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
else:
    razorpay_client = None

# Initialize Cashfree
CASHFREE_APP_ID = os.getenv('VITE_CASHFREE_APP_ID')
CASHFREE_SECRET_KEY = os.getenv('CASHFREE_SECRET_KEY')
CASHFREE_ENV = os.getenv('VITE_CASHFREE_ENV', 'SANDBOX').upper()

if CASHFREE_APP_ID and CASHFREE_SECRET_KEY:
    Cashfree.XClientId = CASHFREE_APP_ID
    Cashfree.XClientSecret = CASHFREE_SECRET_KEY
    Cashfree.XEnvironment = Cashfree.SANDBOX if CASHFREE_ENV == 'SANDBOX' else Cashfree.PRODUCTION
else:
    pass  # Cashfree not configured


# ==================== RAZORPAY ROUTES ====================

@payment_bp.route('/razorpay/order', methods=['POST'])
def create_razorpay_order():
    """Create Razorpay order"""
    try:
        if not razorpay_client:
            return jsonify({'error': 'Razorpay not configured'}), 500
        
        data = request.json
        amount = data.get('amount', 499)  # Amount in rupees
        
        # Create order
        order_data = {
            'amount': int(amount * 100),  # Convert to paise
            'currency': 'INR',
            'payment_capture': 1  # Auto capture
        }
        
        order = razorpay_client.order.create(data=order_data)
        
        return jsonify({
            'id': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'status': order['status']
        }), 200
        
    except Exception as e:
        print(f"Razorpay order error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@payment_bp.route('/razorpay/verify', methods=['POST'])
def verify_razorpay_payment():
    """Verify Razorpay payment signature"""
    try:
        if not razorpay_client:
            return jsonify({'error': 'Razorpay not configured'}), 500
        
        data = request.json
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        
        # Verify signature
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature == razorpay_signature:
            return jsonify({
                'success': True,
                'message': 'Payment verified successfully',
                'payment_id': razorpay_payment_id,
                'order_id': razorpay_order_id
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid signature'
            }), 400
        
    except Exception as e:
        print(f"Razorpay verify error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== CASHFREE ROUTES ====================

@payment_bp.route('/cashfree/order', methods=['POST'])
def create_cashfree_order():
    """Create Cashfree order"""
    try:
        if not CASHFREE_APP_ID or not CASHFREE_SECRET_KEY:
            return jsonify({'error': 'Cashfree not configured'}), 500
        
        data = request.json
        amount = data.get('amount', 499)
        customer_id = data.get('customerId', f'USER_{secrets.token_hex(8)}')
        customer_email = data.get('customerEmail', 'user@example.com')
        customer_phone = data.get('customerPhone', '9999999999')
        
        # Generate unique order ID
        order_id = f'ORDER_{secrets.token_hex(12)}'
        
        # Create order payload
        order_payload = {
            'order_id': order_id,
            'order_amount': float(amount),
            'order_currency': 'INR',
            'customer_details': {
                'customer_id': customer_id,
                'customer_email': customer_email,
                'customer_phone': customer_phone
            },
            'order_meta': {
                'return_url': f'{os.getenv("APP_URL", "http://localhost:3000")}/payment/success?order_id={order_id}'
            }
        }
        
        # Create order using Cashfree SDK
        from cashfree_pg.models.create_order_request import CreateOrderRequest
        from cashfree_pg.api_client import Cashfree
        
        request_obj = CreateOrderRequest(
            order_id=order_id,
            order_amount=float(amount),
            order_currency='INR',
            customer_details={
                'customer_id': customer_id,
                'customer_email': customer_email,
                'customer_phone': customer_phone
            }
        )
        
        response = Cashfree().PGCreateOrder('2023-08-01', request_obj, None, None)
        
        if response and response.data:
            return jsonify({
                'order_id': response.data.order_id,
                'payment_session_id': response.data.payment_session_id,
                'order_status': response.data.order_status
            }), 200
        else:
            return jsonify({'error': 'Failed to create order'}), 500
        
    except Exception as e:
        print(f"Cashfree order error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@payment_bp.route('/cashfree/verify', methods=['POST'])
def verify_cashfree_payment():
    """Verify Cashfree payment"""
    try:
        data = request.json
        order_id = data.get('order_id')
        
        if not order_id:
            return jsonify({'success': False, 'error': 'Order ID required'}), 400
        
        # Fetch order status from Cashfree
        from cashfree_pg.api_client import Cashfree
        
        response = Cashfree().PGOrderFetchPayment('2023-08-01', order_id, None, None)
        
        if response and response.data:
            payment_status = response.data[0].payment_status if response.data else 'UNKNOWN'
            
            if payment_status == 'SUCCESS':
                return jsonify({
                    'success': True,
                    'message': 'Payment verified successfully',
                    'order_id': order_id,
                    'payment_status': payment_status
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'error': f'Payment status: {payment_status}'
                }), 400
        else:
            return jsonify({'success': False, 'error': 'Payment verification failed'}), 500
        
    except Exception as e:
        print(f"Cashfree verify error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== UTILITY ROUTES ====================

@payment_bp.route('/config', methods=['GET'])
def get_payment_config():
    """Get payment gateway configuration"""
    return jsonify({
        'razorpay': {
            'enabled': bool(RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET),
            'key_id': RAZORPAY_KEY_ID
        },
        'cashfree': {
            'enabled': bool(CASHFREE_APP_ID and CASHFREE_SECRET_KEY),
            'env': CASHFREE_ENV
        }
    }), 200
