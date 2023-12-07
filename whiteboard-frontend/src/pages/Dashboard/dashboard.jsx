import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import imagePaths from "../../assets/img/imagePaths";
import axios from 'axios';

const Dashboard = () => {
  const [setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [images, setImages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');



  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };


  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/images/${userId}`);
        console.log('Fetched images:', response.data.images);
        setImages(response.data.images || []);
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([]);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/profile/${userId}`);
        console.log('Fetched user profile:', response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUsername('');
        setEmail('');
      }
    };


    if (userId) {
      fetchUserImages();
      fetchUserProfile();
    }
  }, [userId]);

  const deleteImage = async (filename) => {
    try {
      await axios.delete(`http://localhost:9000/image/${filename}/${userId}`);
      console.log('Deleted image:', filename);
      const response = await axios.get(`http://localhost:9000/images/${userId}`);
      console.log('Images after deletion:', response.data.images);
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };


  const handleLogout = () => {
    setLoggedIn(false);
    setUserId('');
    localStorage.removeItem('token');
    window.location.reload();
  };


  return (
    <>
      <button
        className="btn btn-primary mt-3 mx-4"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
        </svg>
      </button>

      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabIndex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header d-flex justify-content-end">
          <button type="button" className="btn-close " data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul>
            <li >
              <div className="dropdown">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
                  <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
                </svg>
                <button
                  className="btn  dropdown-toggle fs-6 fw-bold  btn2 "
                  type="button"
                  id="dropdownMenuButton"
                  onClick={toggleDropdown}
                  aria-haspopup="true"
                  aria-expanded={showDropdown ? 'true' : 'false'}
                  style={{ marginLeft: '10px'  }}
                >
              <span className='profile'>    Profile</span>
                </button>
                <div
                  className={`dropdown-menu${showDropdown ? ' show' : ''}`}
                  aria-labelledby="dropdownMenuButton"
                >
                  <p className="dropdown-item  fw-bold" >{username}</p>
                  <p className="dropdown-item fw-bold" >{email}</p>
                </div>
              </div>
            </li>

            <li>
              <a href="/" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                </svg>
                <span className=" fs-6 fw-bold" style={{ marginLeft: '12px', padding:'10px' }}> Log Out</span>
              </a>
            </li>
            <li>
              <a href="/main">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                <span className="fs-6 fw-bold" style={{ marginLeft: '12px' , padding:'10px'}} >Create Room</span>
              </a>
            </li>
            <li>
              <a href="/main">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" fill="currentColor" className="bi bi-easel2-fill" viewBox="0 0 16 16">
                  <path d="M8.447.276a.5.5 0 0 0-.894 0L7.19 1H2.5A1.5 1.5 0 0 0 1 2.5V10h14V2.5A1.5 1.5 0 0 0 13.5 1H8.809L8.447.276Z" />
                  <path fillRule="evenodd" d="M.5 11a.5.5 0 0 0 0 1h2.86l-.845 3.379a.5.5 0 0 0 .97.242L3.89 14h8.22l.405 1.621a.5.5 0 0 0 .97-.242L12.64 12h2.86a.5.5 0 0 0 0-1H.5Zm3.64 2 .25-1h7.22l.25 1H4.14Z" />
                </svg> <span className="fs-6 fw-bold" style={{ marginLeft: '12px', padding:'10px' }} >Whiteboard</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active" data-bs-interval="10000">
                <img src={imagePaths.image11} className="d-block w-100" alt="" style={{ height: '70vh' }} />
              </div>
              <div className="carousel-item" data-bs-interval="2000">
                <img src={imagePaths.image12} alt="" className="d-block w-100" style={{ height: '70vh' }} />
              </div>
              <div className="carousel-item">
                <img src={imagePaths.image13} alt="" className="d-block w-100" style={{ height: '70vh' }} />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div className="container">
          <p className="fw-bold fs-2">Your Creations</p>
          <div className="row">
            <ul className="list-unstyled d-flex flex-wrap">
              {images.map((image, index) => (
                <li key={index} className="m-3 position-relative">
                  <img
                    src={`http://localhost:9000/img/${image}`}
                    alt=""
                    className="img-thumbnail"
                    style={{ height: '200px' }}
                  />
                  <button
                    className='btn btn-danger position-absolute top-0 end-0 m-2'
                    onClick={() => deleteImage(image)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                    </svg>
                  </button>
                </li>
              ))}

            </ul>
          </div>


        </div>

      </div>
    </>
  );
}

export default Dashboard;
