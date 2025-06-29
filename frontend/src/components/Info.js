import React from 'react';

const Info = () => (
  <section className="section">
    <div className="container">
      <h2 className="section-title">🙏 Ganesh Chaturthi Mahotsav Info</h2>
      <p>
        Welcome to our Ganesh Chaturthi Mahotsav! Here you’ll find all the details about our event, our team, and how to reach us.
      </p>
      <h3>About the Event</h3>
      <p>
        This year’s Ganesh Chaturthi is organized by Team Mahodara with devotion and joy. Join us for pooja, prasadam, and cultural programs!
      </p>
      <h3>Our Team</h3>
      
      <ul>
        <li>Organizer: <b>Mahodara Team</b></li>
        {/* <li>Lead: <b>Sharma Ji</b></li>
        <li>Volunteers: <b>Ravi, Priya, Anil, Sita</b></li> */}
        {/* Add more team info as needed */}
      </ul>
      <h3>Event Location</h3>
      <div style={{ marginBottom: '1rem' }}>
        <iframe
          title="Event Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d755.2533645870154!2d78.46080394626948!3d17.488573695091954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9100268b8939%3A0x29b6e6441a480c46!2sTEAM%20MAHODARA!5e0!3m2!1sen!2sin!4v1751200445600!5m2!1sen!2sin"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <h3>Contact</h3>
      <p>
        For more info, contact us at <a href="mailto:sambangisunil12@gmail.com">ganesh@mahodara.com</a> or call +91-8919135987.
      </p>
    </div>
  </section>
);

export default Info;