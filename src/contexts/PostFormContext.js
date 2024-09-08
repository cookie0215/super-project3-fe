import React, { createContext, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, modifyPost } from '../api/post';

export const PostFormContext = createContext();

export const PostFormProvider = ({ children }) => {
  const navigate = useNavigate();


  const voteId = () => {
    return `id_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  };

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [voteItems, setVoteItems] = useState([
    { id: voteId(), content: '' },
    { id: voteId(), content: '' }
  ]);
  const [uploadWriteVote, setUploadWriteVote] = useState([]);
  const [isEdit, setIsEdit] = useState(false);


  // 글쓰기페이지에 투표 첨부
  const addVoteToPost = useCallback(() => {
    setUploadWriteVote([...voteItems]);
  }, [voteItems])

  // 글쓰기페이지에 첨부한 투표 삭제
  const removeVoteToPost = useCallback(() => {
    setUploadWriteVote([]);
    setVoteItems([
      { id: voteId(), content: '' },
      { id: voteId(), content: '' },
    ]);
  }, []);


  // 작성한 게시글 등록
  const addPost = useCallback(async () => {
    // 배열 형태의 voteItems를 객체 형태의 voteRequest로 변환
    const isVoteEmpty = voteItems.every(item => !item.content); // 모든 항목이 비어 있는지 확인

    // voteRequest가 필요 없는 경우 null로 설정
    const voteRequest = isVoteEmpty
      ? null
      : voteItems.reduce((acc, item, index) => {
        acc[`item${index + 1}`] = item.content || null; // 텍스트가 없으면 null로 설정
        return acc;
      }, { item1: null, item2: null, item3: null, item4: null });

    const newPostData = {
      category,
      title,
      content,
      voteRequest,
    };

    try {
      const response = await createPost(newPostData);
      const postId = response.id;

      console.log("게시글 데이터:", postId, newPostData);
      navigate(`/post/${postId}`);

    } catch (error) {
      console.log(`게시글 작성 등록 오류 : ${error}`);
    }

  }, [category, title, content, uploadWriteVote]);



  // 게시글 수정
  const updatePost = useCallback(async (id) => {
    const isVoteEmpty = voteItems.every(item => !item.content);

    const voteRequest = isVoteEmpty
      ? null
      : voteItems.reduce((acc, item, index) => {
        acc[`item${index + 1}`] = item.content || null;
        return acc;
      }, { item1: null, item2: null, item3: null, item4: null });

    const updatedPostData = { category, title, content, voteRequest };

    try {
      await modifyPost(id, updatedPostData);
      navigate(`/post/${id}`);

    } catch (error) {
      console.log(`게시글 수정 오류 : ${error}`);
    }
  }, [category, title, content, voteItems, navigate]);

  return (
    <PostFormContext.Provider
      value={{
        category,
        setCategory,
        title,
        setTitle,
        content,
        setContent,
        voteItems,
        setVoteItems,
        uploadWriteVote,
        setUploadWriteVote,
        isEdit,
        setIsEdit,
        addVoteToPost,
        removeVoteToPost,
        addPost,
        updatePost
      }}
    >
      {children}
    </PostFormContext.Provider>
  );
}