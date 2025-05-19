from http.server import BaseHTTPRequestHandler
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request data
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            # Extract form data
            name = data.get('fullname', '')
            email = data.get('email', '')
            message = data.get('message', '')

            # Get email credentials
            email_user = os.environ.get('GMAIL_USER')
            email_password = os.environ.get('GMAIL_PASSWORD')

            # Destination email
            recipient_email = 'riccardoluciocosta@gmail.com'

            # Prepare email
            msg = MIMEMultipart()
            msg['From'] = email_user
            msg['To'] = recipient_email
            msg['Subject'] = f"{name} contacted by AlgorithmX!"

            body = f"""
            Name: {name}
            Email: {email}
            
            His Project:
            {message}
            """
            msg.attach(MIMEText(body, 'plain'))

            # Connect to SMTP server
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(email_user, email_password)

            # Send email - Modificato per inviare all'indirizzo corretto
            text = msg.as_string()
            server.sendmail(email_user, recipient_email, text)  # Qui il cambiamento
            server.quit()

            # Send success response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response = {"success": True, "message": "Thank you! Your message has been sent."}
            self.wfile.write(json.dumps(response).encode('utf-8'))

        except Exception as e:
            # Error handling
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            error_message = str(e)
            print(f"ERROR sending email: {error_message}")
            response = {"success": False, "error": error_message}
            self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()