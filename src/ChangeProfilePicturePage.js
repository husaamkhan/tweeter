import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "./Navigation";

const ChangeProfilePicturePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [picture, setPicture] = useState(null);
    const [new_picture, setNewPicture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect( () => {
        const getProfilePic = async () => {
            try {
                const response = await axios.get(`/user/profile-picture/${location.state.username}`, {
                    responseType: "blob"
                });

                setPicture(URL.createObjectURL(response.data));
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if ( !picture ) { getProfilePic(); }

        return () => {
            if ( picture ) { URL.revokeObjectURL(picture); }
        };
    } );

    const handleUpload = async (e) => {
        try {
            if ( new_picture ) {
                await axios.put(
                    `/user/${location.state.username}/change-profile-picture`,
                    new_picture,
                    {
                        headers: {
                            "Content-Type": "blob"
                        }
                    }
                );

                alert("Profile picture successfully updated!");
            } else {
                alert("Please select a new profile picture!");
                e.preventDefault(); // Prevent redirect
            }
        } catch (err) {
            alert(err);
            setError(err);
        }
    };

    if ( loading ) {
        return (
            <div className="page-container">
            <Navigation />
            <div className="column-divider"></div>
                <div className="content-container">
                    <h1>Loading...</h1>
                </div>
            </div>
        );
    }

    if ( error ) {
        return (
            <div className="page-container">
                <Navigation />
                <div className="column-divider"></div>
                    <div className="content-container">
                        <h1>Oops! An error occured! Please try again later.</h1>
                    </div>
            </div>
      );
    }

    return (
        <div className="page-container">
            <Navigation />
            <div className="column-divider"></div>
            <div className="content-container">
            <h1>Change Profile Picture</h1>
                <img className="profile-pic" src={picture} alt="" />
                <form
                    encType="multipart/form-data"
                    onSubmit={handleUpload}
                    action="/profile"
                >
                    <input
                        className="picture-input"
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => setNewPicture(e.target.files[0])}
                    />
                    <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
};

export default ChangeProfilePicturePage;
