import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: url } = useParams();
  const [keyword, setKeyword] = useState(url || "");

    const submitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim()) {
            setKeyword("");
            navigate(`/search/${keyword}`);
        } else {
            navigate("/");
        }
    }

  return <Form onSubmit={ submitHandler } className="d-flex">
    <Form.Control type="text" name="q" onChange={(e) => setKeyword(e.target.value)} value={keyword} className="mr-sm-2 ml-sm-5 shadow-sm " placeholder="Search Questions..."  style={{border:"thin solid rgba(10, 10, 10,0.03)"}}>
    </Form.Control>
    <Button type="submit" variant="outline-dark" className="p-2 mx-2 text-white bg-success shadow rounded-1" style={{border:"thin solid rgba(150, 150, 50,0.3)"}}>
        Search 
    </Button>
  </Form>;
};

export default SearchBox;
