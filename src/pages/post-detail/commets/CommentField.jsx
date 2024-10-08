import React, { useEffect, useState } from 'react';
import styles from './CommentField.module.scss';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import { createComment, deleteCommentApi, getCommentList, modifyComment } from '../../../api/commentApi';
import fetchUserData from '../../../api/userApi';

const CommentField = ({ postId }) => {
  // 댓글 상태 관리
  const [comments, setComments] = useState([]);

  // 로그인한 유저 ID 상태
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // 댓글 수정 상태
  const [isEditing, setIsEditing] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setLoggedInUserId(userData.id);
      }
    };

    fetchLoggedInUser();
  }, []);


  // 댓글리스트 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentListData = await getCommentList(postId, page, size);
        setComments(commentListData.content);
        console.log(commentListData.content);
      } catch (error) {
        console.error('댓글 목록 로딩 오류:', error);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId, page, size]);


  // 댓글 추가
  const addComment = async (content) => {
    try {
      const newComment = await createComment(postId, content);
      setComments((prevComments) => [
        ...prevComments,
        {
          commentId: newComment.commentId,
          content: newComment.content,
          nickname: newComment.nickname,
          profilePicture: newComment.profilePicture,
          userId: newComment.userId,
          created_at: newComment.created_at,
        },
      ]);
    } catch (error) {
      console.error('댓글 생성 오류:', error);
    }
  }


  // 댓글 수정
  const editComment = async (commentId, newContent) => {
    try {
      const updatedComment = await modifyComment(commentId, postId, newContent);
      setComments(comments.map((comment) =>
        comment.commentId === commentId ? { ...comment, content: updatedComment.content } : comment
      ));
      setIsEditing(null); // 수정모드 종료
    } catch (error) {
      console.error("댓글 수정 오류:", error);
    }
  }


  // 댓글 삭제
  const deleteComment = async (commentId) => {
    try {
      await deleteCommentApi(commentId);
      setComments(comments.filter(comment => comment.commentId !== commentId));
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  // 댓글 입력창 제출 버튼 클릭 시, 조건에 따라 호출
  const handleCommentInputSubmit = (content) => {
    if (isEditing) {
      editComment(isEditing.commentId, content);
    } else {
      addComment(content);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.conmmentCount}>
        댓글 {comments.length}
      </div>

      {
        comments.length > 0 ? (
          <CommentList
            loggedInUserId={loggedInUserId}
            comments={comments}
            onEditClick={(commentId, content) => setIsEditing({ commentId, content })}
            deleteComment={deleteComment}
          />
        ) : (
          <div className={styles.noCommentMsg}>
            <p>아직 댓글이 없어요! 첫 대글을 남겨보세요</p>
          </div>
        )
      }

      <CommentInput
        addComment={handleCommentInputSubmit}
        editComment={isEditing ? handleCommentInputSubmit : null}
        initialText={isEditing?.content || ''}
      />
    </div >
  );
};

export default CommentField;