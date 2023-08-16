import { useEffect, useState } from "react";
import { setCredentials } from "../slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaCheck, FaCheckCircle, FaGoodreads, FaTimes, FaUserPlus } from "react-icons/fa";
import { Table, Form, Button, Row, Col, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useProfileMutation, useProfileImageMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/orderApiSlice";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfile] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { userinfo } = useSelector((state) => state.auth);
  const [profile, {isLoading:loadingUpdateProfile, error}] = useProfileMutation();

  const {data:orders, isLoading, isError} = useGetMyOrdersQuery();
  const [updateProfileImage, {isLoading: loading, error: err}]= useProfileImageMutation();

  console.log(userinfo._id)
  useEffect(() => {
    if (userinfo) {
      setName(userinfo.name);
      setEmail(userinfo.email);
      setProfile(userinfo.profile);
    }
  }, [userinfo, userinfo.name, userinfo.email, userinfo.profile]);


  const updateImageHandler = async(e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await updateProfileImage(formData).unwrap();
      toast.success("Profile Image updated successfully");
      setProfile(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if(password === confirmPassword) {
      try {
        const res = await profile({_id: userinfo._id, name, email, password, profile: profileImage}).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile Updated");
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    } else {
      toast.error("Password do not match")
    }
    
    

  };
  return (
    <Row>
      <Col md={3}>
        <h2 className=" shadow-sm py-3  text-center  ">
          User Profile <Image src={userinfo.profile} alt="Profile image" className=" shadow" style={{ width:"50px", borderRadius:"100px"}} />
        </h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>
                Name
            </Form.Label>
            <Form.Control type="name" value={name} onChange={(e)=> setName(e.target.value)} placeholder="Enter name" className="py-3">
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-2">
            <Form.Label>
                email
            </Form.Label>
            <Form.Control type="email" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="Enter email" className="py-3">
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-2">
            <Form.Label>
                Password
            </Form.Label>
            <Form.Control type="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Enter password" className="py-3">
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-2">
            <Form.Label>
                Profile Image
            </Form.Label>
            <Form.Control type="file" label="choose image" onChange={updateImageHandler} placeholder="Enter profile url" className="my-1 ">
            </Form.Control>
            <Form.Control type="text" value={profileImage} onChange={(e)=> setProfile(e.target.value)} placeholder="Enter profile url" className="py-3">
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmpassword" className="my-2">
            <Form.Label>
              Confirm Password
            </Form.Label>
            <Form.Control type="password" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} placeholder="Confirm password" className="py-3">
            </Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Submit
          </Button>
          { loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h2 className=" border-bottom mt-3">
          Questions
        </h2>
        {isLoading ? <Loader /> : isError ? (
          <Message varient="danger">
              {isError?.data?.message || isError.message}
          </Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>
                  DATE
                </th>
                <th>
                  TOTAL
                </th>
                <th>
                  PAID (&#x20A6;)
                </th>
                <th>

                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order)=> (
                <tr key={order._id}>
                  <td>
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td>
                    {order.total}
                  </td>
                  <td>
                    {order.isPaid ? (<FaCheck className="text-primary" />) : (<FaTimes className="text-danger" />)}
                  </td>
                  
                  <td>
                    <LinkContainer to={`/ordered/${order._id}/${order.user}`}>
                      {order.isPaid ? (
                        <Button className="btn-sm" variant="light">
                        Details
                      </Button>
                      ) : (
                        <p></p>
                      )}
                        
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
