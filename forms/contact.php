<?php
  /**
  * Requires the "PHP Email Form" library
  * The "PHP Email Form" library is available only in the pro version of the template
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  * For more info and help: https://bootstrapmade.com/php-email-form/
  */

  // Replace with your real receiving email address
  $receiving_email_address = 'peterwallacekaraja@gmail.com';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  // Allow only POST requests to avoid 405 errors
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
  }
  
  // Basic validation: ensure required fields are present and non-empty
  $required_fields = ['name', 'email', 'subject', 'message'];
  foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
      http_response_code(400);
      die('Missing or empty field: ' . $field);
    }
  }
  
  $contact = new PHP_Email_Form;
  $contact->ajax = true;
  
  // SMTP configuration for reliable email delivery
  $contact->smtp = array(
    'host' => 'smtp.gmail.com',
    'username' => 'peterwallacekaraja@gmail.com',
    'password' => 'Mercedesbenz@19', // Replace with your Gmail app password
    'port' => '587'
  );

  $contact->to = $receiving_email_address;
  $contact->from_name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
  $contact->from_email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
  $contact->subject = filter_var($_POST['subject'], FILTER_SANITIZE_STRING);

  $contact->add_message($contact->from_name, 'From');
  $contact->add_message($contact->from_email, 'Email');
  $contact->add_message(filter_var($_POST['message'], FILTER_SANITIZE_STRING), 'Message', 10);

  echo $contact->send();
?>
