<?php
  /**
   * Requires the "PHP Email Form" library
   * The "PHP Email Form" library is available only in the pro version of the template
   * The library should be uploaded to: vendor/php-email-form/php-email-form.php
   * For more info and help: https://bootstrapmade.com/php-email-form/
   */

  // Replace with your actual receiving email address
  $receiving_email_address = 'peterwallacekaraja@gmail.com';

  // Ensure the required library file exists
  $php_email_form = __DIR__ . '/../assets/vendor/php-email-form/php-email-form.php';

  if (!file_exists($php_email_form)) {
    die('Unable to load the "PHP Email Form" Library!');
  }
  
  include($php_email_form);

  // Allow only POST requests to prevent 405 errors
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
  }

  // Validate required fields
  $required_fields = ['name', 'email', 'subject', 'message'];
  foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
      http_response_code(400);
      die('Missing or empty field: ' . $field);
    }
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;

  // Secure SMTP settings (use environment variables instead of hardcoded passwords)
  $contact->smtp = array(
    'host' => 'smtp.gmail.com',
    'username' => 'peterwallacekaraja@gmail.com',
    'password' => getenv('SMTP_PASSWORD'), // Fetch from environment
    'port' => '587',
    'secure' => 'tls'
  );
  

  $contact->to = $receiving_email_address;
  $contact->from_name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
  $contact->from_email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

  if (!$contact->from_email) {
    http_response_code(400);
    die('Invalid email format.');
  }

  $contact->subject = htmlspecialchars($_POST['subject'], ENT_QUOTES, 'UTF-8');

  // Add email message
  $contact->add_message($contact->from_name, 'From');
  $contact->add_message($contact->from_email, 'Email');
  $contact->add_message(htmlspecialchars($_POST['message'], ENT_QUOTES, 'UTF-8'), 'Message', 10);

  // Send email and return response
  if ($contact->send()) {
    echo 'Email sent successfully!';
  } else {
    http_response_code(500);
    echo 'Failed to send email.';
  }
?>
