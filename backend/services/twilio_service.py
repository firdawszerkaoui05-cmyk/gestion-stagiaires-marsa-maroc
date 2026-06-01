# -*- coding: utf-8 -*-
"""Service d'envoi SMS via Twilio."""
import os
from twilio.rest import Client


def normalize_phone_number(number):
    if not number:
        return None
    raw = ''.join(ch for ch in number if ch.isdigit() or ch == '+')
    if raw.startswith('00'):
        raw = '+' + raw[2:]
    if raw.startswith('0') and len(raw) == 10:
        return '+212' + raw[1:]
    if raw.startswith('+'):
        return raw
    if raw.isdigit() and len(raw) == 9:
        return '+212' + raw
    if raw.isdigit() and len(raw) > 10:
        return '+' + raw
    return raw


def send_sms(to_number, body):
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    from_number = os.getenv('TWILIO_FROM_NUMBER')

    if not account_sid or not auth_token or not from_number:
        raise EnvironmentError(
            'Twilio non configuré. Définissez TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN et TWILIO_FROM_NUMBER.'
        )

    to_number = normalize_phone_number(to_number)
    if not to_number:
        raise ValueError('Numéro de téléphone invalide pour l\'envoi SMS.')

    print(f"Envoi SMS à {to_number}: {body}")  # Debug log

    client = Client(account_sid, auth_token)
    message = client.messages.create(
        body=body,
        from_=from_number,
        to=to_number
    )
    print(f"SMS envoyé avec SID: {message.sid}")  # Debug log
    return message.sid
