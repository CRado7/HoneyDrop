// src/components/AuthModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import AuthPanel from './AuthPanel';

export default function AuthModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard>
      <Modal.Header closeButton>
        <Modal.Title className="ms-auto">Welcome</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <AuthPanel onClose={onHide} onSuccess={onHide}/>
      </Modal.Body>
    </Modal>
  );
}


