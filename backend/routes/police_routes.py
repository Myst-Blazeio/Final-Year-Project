from flask import Blueprint, render_template, request, redirect, url_for, flash, make_response, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from werkzeug.security import check_password_hash, generate_password_hash
from db import get_db
import datetime
from bson import ObjectId

police_bp = Blueprint('police', __name__)

@police_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        db = get_db()
        user = db.police.find_one({'username': username})
        
        if user and check_password_hash(user['password_hash'], password):
            access_token = create_access_token(identity=str(user['_id']), additional_claims={"role": "police", "station_id": user.get('station_id')})
            resp = make_response(redirect(url_for('police.dashboard')))
            set_access_cookies(resp, access_token)
            return resp
        else:
            flash('Invalid credentials or not a police account', 'error')
            
    return render_template('police/login.html')

@police_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        full_name = request.form.get('full_name')
        police_id = request.form.get('police_id')
        station_id = request.form.get('station_id')
        
        db = get_db()
        
        if db.police.find_one({'username': username}):
            flash('Username already exists', 'error')
            return redirect(url_for('police.signup'))
            
        if db.police.find_one({'police_id': police_id}):
             flash('Police ID already registered', 'error')
             return redirect(url_for('police.signup'))

        new_user = {
            'username': username,
            'full_name': full_name,
            'role': 'police',
            'police_id': police_id,
            'station_id': station_id,
            'password_hash': generate_password_hash(password),
            'created_at': datetime.datetime.utcnow()
        }
        
        db.police.insert_one(new_user)
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('police.login'))

    return render_template('police/signup.html')

@police_bp.route('/logout')
def logout():
    resp = make_response(redirect(url_for('police.login')))
    unset_jwt_cookies(resp)
    return resp

@police_bp.route('/dashboard')
@jwt_required()
def dashboard():
    current_user_id = get_jwt_identity()
    db = get_db()
    user = db.police.find_one({'_id': ObjectId(current_user_id)})
    
    if not user:
        return redirect(url_for('police.login'))
        
    # Fetch Stats (Mock or Real)
    # Total Pending FIRs for this station
    pending_firs_count = db.firs.count_documents({'station_id': user.get('station_id'), 'status': 'Pending'})
    
    # Recent FIRs
    recent_firs = list(db.firs.find({'station_id': user.get('station_id')}).sort('created_at', -1).limit(5))
    
    return render_template('police/dashboard.html', user=user, pending_count=pending_firs_count, firs=recent_firs)
