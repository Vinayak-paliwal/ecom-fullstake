import React from 'react'

const Contact_main = () => {
  return (
    <>
     <section id="contact-details" className="section-p1">
        <div className="details">
            <span>GET IN TOUCH</span>
            <h2>Visit one of our agency loaction or contact us today</h2>
            <h3>Head Office</h3>
            <div>
                <li>
                    <i className="fa-solid fa-map-pin"></i>
                    <p>56 Glassford Street Glasgow G1 1UL </p>
                </li>
                <li>
                    <i className="fa-solid fa-envelope"></i>
                    <p>vinayakpaliwal866@gmail.com</p>
                </li>
                <li>
                    <i className="fa-solid fa-phone"></i>
                    <p>https://github.com/Vinayak-paliwal</p>
                </li>
                <li>
                    <i className="fa-solid fa-clock"></i>
                    <p>Monday to saturday: 9:00am to 8:00pm</p>
                </li>
            </div>
        </div>
        <div className="map">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.6051569654687!2d75.82255367543573!3d26.805115676711416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9556c7077bd%3A0x1d856d839c6b8cda!2sDazzler%20Software%20Pvt%20Ltd%20Pratap%20Nagar!5e1!3m2!1sen!2sin!4v1749973195908!5m2!1sen!2sin"
                 width="600" height="450" style={{border: "0"}} allowfullscreen="" loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"></iframe>

                
        </div>
    </section>

    <section id="form-details">
        <form action="">
            <span>LEAVE A MESSAGE</span>
            <h2>We love to hear from you</h2>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your E-Mail" />
            <input type="text" placeholder="Subject" />
            <textarea name="" id="" cols="30" rows="10"></textarea>
            <button type="submit" className="normal">Submit</button>
        </form>
        <div className="people">
            <div>
                <img src="img/people/1.png" alt="P-1" />
                <p>
                    <span>John Doe</span> Senior Marketing Manager <br />Phone: +000 123
                    000 77 88 <br />Email: contact@gmail.com
                </p>
            </div>
            <div>
                <img src="img/people/2.png" alt="P-1" />
                <p>
                    <span>Willam Smith</span> Senior Marketing Manager <br />Phone: +000
                    123 000 77 88 <br />Email: contact@gmail.com
                </p>
            </div>
            <div>
                <img src="img/people/3.png" alt="P-1" />
                <p>
                    <span>Emma Stone</span> Senior Marketing Manager <br />Phone: +000
                    123 000 77 88 <br />Email: contact@gmail.com
                </p>
            </div>
        </div>
    </section>
    </>
  )
}

export default Contact_main