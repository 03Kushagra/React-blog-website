import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  orderBy,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import HTMLReactParser from "html-react-parser";

const Detail = ({ setActive, user }) => {
  const userId = user?.uid;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getRecentBlogs = async () => {
      const blogRef = collection(db, "blogs");
      const recentBlogs = query(
        blogRef,
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const docSnapshot = await getDocs(recentBlogs);
      setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    getRecentBlogs();
  }, []);

  useEffect(() => {
    id && getBlogDetail();
  }, [id]);

  const getBlogDetail = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const docRef = doc(db, "blogs", id);
    const blogDetail = await getDoc(docRef);
    
    if (!blogDetail.exists()) {
      console.log("No such document!");
      setLoading(false);
      return;
    }
    
    const blogData = blogDetail.data();
    setBlog(blogData);
  
    // Fetch a limited number of blogs for performance
    const recentBlogsQuery = query(blogRef, orderBy("timestamp", "desc"), limit(10));
    const recentBlogSnapshot = await getDocs(recentBlogsQuery);
    const allBlogs = recentBlogSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
    setActive(null);
    setLoading(false);
  };

  return (
    <div className="single">
      <div
        className="blog-title-box"
        style={{ backgroundImage: `url('${blog?.imgUrl}')` }}
      >
        <div className="overlay"></div>
        <div className="blog-title">
          <span>{blog?.timestamp.toDate().toDateString()}</span>
          <h2>{blog?.title}</h2>
        </div>
      </div>
      <div className="container-fluid pb-4 pt-4 padding blog-single-content">
        <div className="container padding">
          <div className="row mx-0">
            <div className="col-md-8">
              <span className="meta-info text-start">
                By <p className="author">{blog?.author}</p> -&nbsp;
                {blog?.timestamp.toDate().toDateString()}
              </span>
              <div className="text-start">
                {HTMLReactParser(blog?.description || '')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
