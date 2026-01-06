require('dotenv').config({ path: '.env' });
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('🔧 Testing SES SMTP Configuration...\n');

  // Check environment variables
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];
  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    process.exit(1);
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Test connection
    console.log('📧 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    const testEmail = process.env.SMTP_FROM;
    console.log(`📨 Sending test email to: ${testEmail}`);

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: "quentin.leclercbte@gmail.com",
      subject: '✅ Flex Tournaments - SMTP Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px;">
            <h2 style="color: #4f46e5;">🎯 SMTP Configuration Test</h2>
            <p>This is a test email from Flex Tournaments.</p>
            <p><strong>If you're reading this, your email configuration is working!</strong></p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Sent at: ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `,
      text: 'SMTP Configuration Test - If you received this, your email setup is working!',
    });

    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}\n`);
    console.log('💡 Check your inbox (or spam folder) for the test email.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Invalid login')) {
      console.error('\n⚠️  Common causes:');
      console.error('   - Wrong SMTP_USER or SMTP_PASSWORD');
      console.error('   - Email not verified in SES');
      console.error('   - Wrong SMTP_HOST region');
    }
    process.exit(1);
  }
}

testEmail();
