import React, { useState } from 'react';
import { Card, Badge, Spinner, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { PlusLg, Trash } from 'react-bootstrap-icons';
import Sidebar from '../components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

import { useUserWebsites, useCreateWebsite, useDeleteWebsite } from '../hooks/useWebsites';
import { useCurrentUser } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useCurrentUser();
  const { websites, loading, error, refetch } = useUserWebsites();
  const { create, loading: creating } = useCreateWebsite();
  const { deleteWebsite, loading: deleting } = useDeleteWebsite();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);

  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const res = await create({
        variables: {
          input: {
            name: siteName
          }
        }
      });
  
      const site = res.data?.createWebsite;
      const slug = site.name.toLowerCase().replace(/\s+/g, '-');
  
      if (site?.id) {
        navigate(`/website/${site.id}`);
      }
  
      setShowCreateModal(false);
      setSiteName('');
    } catch (err) {
      console.error('Error creating website:', err);
    }
  };  

  const handleDelete = async () => {
    if (!siteToDelete) return;
    try {
      await deleteWebsite({ variables: { id: siteToDelete.id } });
      setShowDeleteModal(false);
      setSiteToDelete(null);
      refetch();
    } catch (err) {
      console.error('Error deleting website:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-danger">
        Failed to load your websites. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-5">
      <Sidebar />
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div>
          <h2 className="fw-bold mb-1">Welcome, {user?.name || 'User'}!</h2>
          <Badge bg="warning" text="dark">{user?.planPackage || 'Free Plan'}</Badge>
        </div>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {websites.map((site) => {
          const slug = site.name.toLowerCase().replace(/\s+/g, '-'); // or use a utility slugify function

          return (
            <Col key={site.id}>
              <Card className="h-100 shadow-sm position-relative">
                <div
                  role="button"
                  onClick={() => navigate(`/website/${site.id}`)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && navigate(`/website/${site.id}`)
                  }
                  tabIndex={0}
                  className="text-decoration-none text-dark position-relative h-100"
                >
                  <Card.Img
                    variant="top"
                    src={site.thumbnail || '/placeholder-thumb.jpg'}
                    alt={site.name}
                    style={{ objectFit: 'cover', height: 150 }}
                  />
                  <Card.Body>
                    <Card.Title className="text-truncate mb-0">{site.name}</Card.Title>
                  </Card.Body>
                </div>

                {/* Delete Button */}
                <Button
                  variant="danger"
                  size="sm"
                  style={{ position: 'absolute', top: 10, right: 10 }}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigating
                    setSiteToDelete(site);
                    setShowDeleteModal(true);
                  }}
                >
                  <Trash size={16} />
                </Button>
              </Card>
            </Col>
                );
              })}

        {/* Add New Website Card */}
        <Col>
          <div className="position-relative" style={{ width: '100%', paddingBottom: '100%' }}>
            <Card
              className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center text-center bg-light border"
              style={{ border: '2px dashed #ccc', cursor: 'pointer' }}
              onClick={() => setShowCreateModal(true)}
            >
              <PlusLg size={40} className="text-muted" />
            </Card>
          </div>
        </Col>
      </Row>

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Website</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="websiteName">
              <Form.Label>Website Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Portfolio Site"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!siteName || creating}
            onClick={handleCreate}
          >
            {creating ? 'Creating...' : 'Create Website'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{siteToDelete?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
