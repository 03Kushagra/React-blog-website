import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  orderBy,
  where,
  startAfter,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import BlogSection from "../components/BlogSection";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { isEmpty, isNull } from "lodash";
import { useLocation } from "react-router-dom";

const Home = ({ setActive, user, active }) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [totalBlogs, setTotalBlogs] = useState(null);
  const [hide, setHide] = useState(false);
  const location = useLocation();

  useEffect(() => {
    
    const unsub = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        
        snapshot.docs.forEach((doc) => {
         
          list.push({ id: doc.id, ...doc.data() });
        });
       
      
        setTotalBlogs(list);
        // setBlogs(list);
        setLoading(false);
        setActive("home");
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
     
    };
  }, [setActive, active]);

  useEffect(() => {
    getBlogs();
    setHide(false);
  }, [active]);

  const getBlogs = async () => {
    const blogRef = collection(db, "blogs");
    console.log(blogRef);
    const firstFour = query(blogRef, orderBy("title"), limit(4));
    const docSnapshot = await getDocs(firstFour);
    setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
  };

  console.log("blogs", blogs);

  const updateState = (docSnapshot) => {
    const isCollectionEmpty = docSnapshot.size === 0;
    if (!isCollectionEmpty) {
      const blogsData = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs((blogs) => [...blogs, ...blogsData]);
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } else {
      toast.info("No more blog to display");
      setHide(true);
    }
  };

  const fetchMore = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const nextFour = query(
      blogRef,
      orderBy("title"),
      limit(4),
      startAfter(lastVisible)
    );
    const docSnapshot = await getDocs(nextFour);
    updateState(docSnapshot);
    setLoading(false);
  };

  const searchBlogs = async () => {
    const blogRef = collection(db, "blogs");
    setHide(true);
    setActive("");
  };

  if (loading) {
    return <Spinner />;
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure wanted to delete that blog ?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog deleted successfully");
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (isEmpty(value)) {
      console.log("test");
      getBlogs();
      setHide(false);
    }
  };

  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <div className="row mx-0">
          
          <div className="col-md-12">
            {blogs.length === 0 && location.pathname !== "/" && (
              <>
                <h4>
                  No Blog found with search keyword:{" "}
                </h4>
              </>
            )}
            {blogs?.map((blog) => (
              <BlogSection
                key={blog.id}
                user={user}
                handleDelete={handleDelete}
                {...blog}
              />
            ))}

            {!hide && (
              <button className="btn btn-primary" onClick={fetchMore}>
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
