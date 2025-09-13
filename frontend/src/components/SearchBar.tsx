import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState<string>(urlKeyword || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword("");
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex">
      <Form.Control
        type="text"
        placeholder="Search"
        value={keyword}
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        className="mr-sm-2 ml-sm-5"
      />
      <Button type="submit" variant="outline-light" className="p-2 mx-1">
        <FaSearch />
      </Button>
    </Form>
  );
};
export default SearchBar;
