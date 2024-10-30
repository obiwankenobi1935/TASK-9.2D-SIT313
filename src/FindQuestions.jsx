import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc } from 'firebase/firestore';
import './FindQuestions.css';  // Import FindQuestion specific styles

const FindQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    abstract: '',
    tags: '',
    content: '',
    createdAt: new Date(),
  });

  useEffect(() => {
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const questionsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuestions(questionsData);
      setFilteredQuestions(questionsData);  // Initialize filtered questions
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Filter questions based on searchTerm
    const filtered = questions.filter((question) => {
      const matchesTitle = question.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesTitle || matchesTags;
    });
    setFilteredQuestions(filtered);
  }, [searchTerm, questions]);

  const handleDeleteQuestion = async (id) => {
    await deleteDoc(doc(db, 'questions', id));
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.title || !newQuestion.abstract || !newQuestion.tags) {
      alert('Please fill in all fields');
      return;
    }

    const tagsArray = newQuestion.tags.split(',').map(tag => tag.trim());
    await addDoc(collection(db, 'questions'), {
      ...newQuestion,
      tags: tagsArray,
      createdAt: new Date(),
    });

    setNewQuestion({ title: '', abstract: '', tags: '', content: '', createdAt: new Date() });
  };

  return (
    <div className="question-container">
      <h2>Find Questions</h2>

      <input
        type="text"
        placeholder="Search by title or tag"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <form onSubmit={handleAddQuestion} className="add-question-form">
        <input
          type="text"
          placeholder="Title"
          value={newQuestion.title}
          onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Abstract"
          value={newQuestion.abstract}
          onChange={(e) => setNewQuestion({ ...newQuestion, abstract: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={newQuestion.tags}
          onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={newQuestion.content}
          onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
        />
        <button type="submit">Add Question</button>
      </form>

      <div className="question-list">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="question-card">
            <h3>{question.title}</h3>
            <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
            <div className="question-details">
              <p><strong>Abstract:</strong> {question.abstract}</p>
              <p><strong>Tags:</strong> {question.tags.join(', ')}</p>
              <p><strong>Date:</strong> {new Date(question.createdAt.toDate()).toDateString()}</p>
              <p>{question.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindQuestion;
