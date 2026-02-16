# GDPR Compliance Guide for Dream Home 3D

## Overview
This document outlines the GDPR compliance measures implemented in the Dream Home 3D conversion service.

---

## 1. Data Collection & Usage

### What Data We Collect
- First Name *
- Last Name *
- Email Address * (Primary identifier)
- Phone Number (Optional)
- Uploaded floor plan files
- Order information

### Why We Collect It
- **Essential (*)**: Required to process orders and provide the service
- **Optional**: For improved customer support

### Legal Basis
- **Legitimate Interest**: Processing orders and providing services
- **Consent**: Marketing communications (opt-in)
- **Contract Fulfillment**: Delivering the 3D conversion service

---

## 2. User Consent Implementation

### Current Consent Mechanisms

#### ✅ MANDATORY Consent Checkboxes
1. **Terms of Service & Privacy Policy Acceptance**
   - Must be checked before purchase
   - Links to full legal documents
   - Explicitly acknowledged by user

2. **Data Processing Consent**
   - Must be checked before purchase
   - Specific consent for GDPR Article 6(1)(a)
   - Processing for order fulfillment

#### 📧 OPTIONAL Consent
1. **Marketing Communications**
   - Pre-unchecked (opt-in, not opt-out)
   - User can choose to receive updates
   - Easy to withdraw consent

---

## 3. Consent Record Tracking

### What's Stored for Each Order
```json
{
  "orderId": "ORD-1234567890",
  "timestamp": "2024-01-15T10:30:00Z",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "gdpr": {
    "termsAgreed": true,
    "dataProcessingConsent": true,
    "marketingConsent": false,
    "consentTimestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Why This Matters
- **Proof of Consent**: Timestamp shows when user consented
- **Audit Trail**: Demonstrates GDPR compliance
- **Right to Withdrawal**: Can revoke consent anytime
- **Transparency**: Clear record of what was consented to

---

## 4. Data Rights (User Rights)

### Users Can Exercise These Rights:

#### Right to Access (GDPR Art. 15)
- Users can request all personal data held about them
- Create an `/api/user-data/{email}` endpoint

#### Right to Rectification (GDPR Art. 16)
- Users can correct their information
- Create an update profile feature

#### Right to Erasure (GDPR Art. 17)
- "Right to be Forgotten"
- Create a `/api/user-data/{email}/delete` endpoint
- Keep anonymized order records for business purposes

#### Right to Data Portability (GDPR Art. 20)
- Users can download their data as JSON/CSV
- Create a `/api/user-data/{email}/export` endpoint

#### Right to Object (GDPR Art. 21)
- Users can opt-out of marketing
- Simple unsubscribe link in emails

---

## 5. Required Actions (TODO)

### Immediate (Before Launch)
- [ ] Create Privacy Policy page (`/privacy`)
- [ ] Create Terms of Service page (`/terms`)
- [ ] Implement backend order storage with GDPR data
- [ ] Add email verification (confirm email ownership)
- [ ] Set up GDPR data request endpoint

### Short-term (First Month)
- [ ] Implement data deletion functionality
- [ ] Create user account dashboard
- [ ] Add "Download my data" feature
- [ ] Set up email unsubscribe mechanism
- [ ] Add cookie consent banner

### Medium-term (First Quarter)
- [ ] Privacy impact assessment (DPIA)
- [ ] Data processing agreement (DPA) with any vendors
- [ ] Data retention policy (e.g., delete after 2 years)
- [ ] Breach notification procedures
- [ ] Staff GDPR training

---

## 6. Data Security Best Practices

### Frontend (Already Implemented)
✅ Client-side form validation
✅ HTTPS required (ensure in production)
✅ Sensitive data not logged in console

### Backend (TO IMPLEMENT)
- [ ] Encrypt sensitive data in database
- [ ] Use HTTPS only (TLS 1.2+)
- [ ] Hash passwords if users create accounts
- [ ] Implement access controls
- [ ] Regular security audits
- [ ] Database backups & disaster recovery

---

## 7. Privacy Policy - Key Sections

Your Privacy Policy MUST include:

```markdown
## 1. Data Controller
HouseInMeta (Company info)

## 2. Data Collection
- What data we collect
- How we collect it
- Legal basis for processing

## 3. Data Usage
- Service delivery
- Communications
- Marketing (opt-in)
- Analytics

## 4. Data Retention
- We keep your data for [X months/years]
- Backup data retained for [X time]
- You can request deletion anytime

## 5. Data Sharing
- No third-party sharing without consent
- Essential vendors (payment processors)
- Legal obligations

## 6. Your Rights
- Right to access
- Right to rectification
- Right to erasure
- Right to data portability
- Right to object

## 7. Cookies
- What cookies we use
- How to manage them

## 8. Contact
- How to contact privacy@houseinmeta.com
- How to file a complaint with DPA
```

---

## 8. Marketing Email Compliance (GDPR + CASL)

### Email Requirements
- [ ] Clear "From" address
- [ ] Unsubscribe link in EVERY email
- [ ] Honor unsubscribe within 10 days
- [ ] Don't send to users without marketing consent
- [ ] Track consent separately per region

### Unsubscribe Implementation
```html
<p>
  <a href="https://houseinmeta.com/unsubscribe?email=user@example.com&token=xyz">
    Unsubscribe from marketing emails
  </a>
</p>
```

---

## 9. Data Processing Agreement (DPA)

If using third-party vendors, ensure they have:
- [ ] Data Processing Agreement signed
- [ ] GDPR compliance certification
- [ ] Sub-processor transparency
- [ ] Data transfer mechanisms (if international)

### Vendors to Review
- Payment processor (Stripe, PayPal, etc.)
- Email service (SendGrid, Mailchimp, etc.)
- Cloud storage (AWS, Google Cloud, etc.)
- Analytics (Google Analytics with anonymization)

---

## 10. Breach Notification Plan

If a data breach occurs:
1. **Assess Risk** → Does it threaten user rights?
2. **Notify Authority** → Within 72 hours to Data Protection Authority
3. **Notify Users** → Without undue delay if high risk
4. **Document** → Keep full records of breach

**Contact Template:**
```
To: [Data Protection Authority]
From: HouseInMeta Legal
Subject: Data Breach Notification - Article 33

Details of breach, affected users, measures taken...
```

---

## 11. Backend API Endpoints (TODO)

### Get User Data
```
GET /api/user-data/{email}
Headers: Authorization: Bearer {token}
Response: JSON with all user data
```

### Export User Data
```
GET /api/user-data/{email}/export
Headers: Authorization: Bearer {token}
Response: JSON/CSV download
```

### Delete User Data
```
DELETE /api/user-data/{email}
Headers: Authorization: Bearer {token}
Response: Confirmation + anonymization
```

### Manage Marketing Consent
```
PUT /api/user-preferences/{email}/marketing
Body: { "marketing_consent": false }
Response: Updated preferences
```

---

## 12. Checklist for Production Launch

- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] GDPR notices in app (✓ Implemented)
- [ ] Consent checkboxes (✓ Implemented)
- [ ] Email verification
- [ ] HTTPS enabled
- [ ] Order data encrypted
- [ ] Data retention policy
- [ ] Breach notification plan
- [ ] DPA with vendors
- [ ] Right to deletion endpoint
- [ ] Data export endpoint
- [ ] Marketing unsubscribe link
- [ ] Cookie consent banner
- [ ] Privacy officer contact info
- [ ] Legal review completed

---

## 13. Testing GDPR Compliance

### Manual Testing
1. Create account without checking consent → Should block
2. Check consent → Should allow purchase
3. Try to export data → Should download JSON
4. Try to delete account → Should anonymize
5. Unsubscribe from email → Should remove from list

### Automated Testing
```javascript
// Test consent validation
test('Should block purchase without data processing consent', () => {
  const valid = validateConsents({
    termsAgreed: true,
    dataProcessingConsent: false
  });
  expect(valid).toBe(false);
});
```

---

## 14. Regular Compliance Reviews

- **Monthly**: Check consent rates and data requests
- **Quarterly**: Review data retention practices
- **Annually**: Full GDPR audit and staff training

---

## Questions?

Contact your Data Protection Officer or Privacy Team before making changes to data collection or usage.

---

**Last Updated:** [Current Date]
**GDPR Version:** 2024 v1.0
