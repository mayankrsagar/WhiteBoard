import React from "react";
import { Link } from 'react-router-dom';
import "../Components/Home.css";
import imagePaths from "../assets/img/imagePaths";

const Home = () => {
    return (
        <>
            <section id="section1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7">
                            <p className="fs-1 mt-5">The go-to digital whiteboard for real-time collaboration</p>
                            <p className="fs-5 mt-2 ">Easily share ideas and collaborate with others—in real-time or asynchronously—with a free online whiteboard from Draw.</p>
                            <Link to="/login" className="btn btn-info p-3" style={{marginTop:"-0vh"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="currentColor" className="bi bi-caret-right" viewBox="0 0 16 16">
                                    <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                                </svg> Start a Whiteboard
                            </Link>
                        </div>
                        <div className="col mt-5" style={{ paddingTop: '10vh' }}>
                            <img src={imagePaths.image1} alt="Digital Whiteboard" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="section2">
                <div className="container ">
                    <div className="text-center">
                        <div className="my-5">
                            <p className="fs-2" style={{ padding: '0 15vh' }}>
                                Easy-to-use functionality designed for seamless team collaboration
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <img src={imagePaths.image2} alt="Infinite & Resizable Canvas" className="img-fluid" style={{ height: '12vh' }} />
                            <p className="fs-5">Infinite & resizable canvas options</p>
                            <p>Choose the right canvas for your collaboration goals — flexibility without limits.</p>
                        </div>
                        <div className="col">
                            <img src={imagePaths.image4} alt="Video Meeting Integrations" className="img-fluid" style={{ height: '12vh' }} />
                            <p className="fs-5">Video meeting integrations</p>
                            <p>Seamlessly add visual collaboration to meetings with Microsoft Teams, Webex, and Zoom integrations.</p>
                        </div>
                        <div className="col">
                            <img src={imagePaths.image3} alt="Easy Sharing" className="img-fluid" style={{ height: '12vh' }} />
                            <p className="fs-5">Easy sharing</p>
                            <p>Share your workspace instantly with anyone in the world using our unique URL system.</p>
                        </div>
                    </div>
                </div>
            </section>


            <section id='section3'>
                <div className="container">
                    <div className="row my-5">
                        <p className="fs-2">How to get started with online whiteboarding</p>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <img src={imagePaths.image5} alt="Getting Started Step 1" className="img-fluid" style={{ height: '12vh' }} />
                            <p className="fs-5">Step 1: Sign Up</p>
                            <p>Create an account to access our online whiteboarding tools.</p>
                        </div>
                        <div className="col-md-4">
                            <img src={imagePaths.image6} alt="Getting Started Step 2" className="img-fluid" style={{ height: '12vh' }} />
                            <p className="fs-5">Step 2: Choose a Board</p>
                            <p>Select a whiteboard or create a new one to begin collaborating.</p>
                        </div>
                        <div className="col-md-4">
                            <img src={imagePaths.image7} alt="Getting Started Step 3" className="img-fluid" style={{ height: '12vh' }} />
                            <p className="fs-5">Step 3: Start Collaborating</p>
                            <p>Invite team members and start collaborating in real-time!</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id='section4'>
                <div className="container">
                    <div className="row my-5">
                        <p className="fs-2">Contact Us</p>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p>For any inquiries or support, feel free to contact us at:</p>
                            <p>Email: example@example.com</p>
                            <p>Phone: +1234567890</p>
                            <p>Address: 123 Street, City, Country</p>
                        </div>
                        <div className="col-md-6">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea className="form-control" id="message" rows="4"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p>Follow Us</p>
                            <div>
                                <a href="https://facebook.com"><img src={imagePaths.image8} alt="Facebook" style={{ height: '5vh', margin: '3vh' }} /></a>
                                <a href="https://twitter.com"><img src={imagePaths.image9} alt="Twitter" style={{ height: '5vh', margin: '3vh' }} /></a>
                                <a href="https://instagram.com"><img src={imagePaths.image10} alt="Instagram" style={{ height: '5vh', margin: '3vh' }} /></a>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <p>&copy; 2023 YourWebsite. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Home;
