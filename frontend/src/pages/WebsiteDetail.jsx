import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { PlusLg, Trash } from 'react-bootstrap-icons';
import { usePagesBySite, useCreatePage, useDeletePage } from '../hooks/usePages';
import { useWebsiteById } from '../hooks/useWebsites';  // <-- import site hook
import Sidebar from '../components/Sidebar/Sidebar';
import { useCurrentUser } from '../hooks/useAuth'; // assuming you have this

function getFirstImageFromHtml(html) {
  if (!html) return null;
  const div = document.createElement('div');
  div.innerHTML = html;
  const img = div.querySelector('img');
  return img ? img.src : null;
}

export default function WebsiteDetail() {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  // Fetch site data using your hook
  const { website, loading: siteLoading, error: siteError } = useWebsiteById(websiteId);

  // Fetch pages data
  const { data, loading: pagesLoading, error: pagesError, refetch } = usePagesBySite(websiteId);

  const [createPage, { loading: creating }] = useCreatePage();
  const [deletePage, { loading: deleting }] = useDeletePage();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pageName, setPageName] = useState('');
  const [pageToDelete, setPageToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCreatePage = async () => {
    try {
      await createPage({
        variables: {
          input: {
            site: websiteId,
            title: pageName,
            slug: pageName.toLowerCase().replace(/\s+/g, '-'),
          },
        },
      });
      setPageName('');
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      console.error('Error creating page:', err);
    }
  };

  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    try {
      await deletePage({ variables: { id: pageToDelete.id } });
      setPageToDelete(null);
      setShowDeleteModal(false);
      refetch();
    } catch (err) {
      console.error('Error deleting page:', err);
    }
  };

  if (siteLoading || pagesLoading) {
    return (
      <div className="p-4 text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (siteError) {
    return <div className="p-4 text-danger">Failed to load site data.</div>;
  }

  if (pagesError) {
    return <div className="p-4 text-danger">Failed to load pages.</div>;
  }

  const pages = data?.getPagesBySite || [];

  return (
    <div className="p-5">
      <Sidebar />
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold mb-0">{website?.name || 'Untitled Site'}</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <PlusLg className="me-2" /> Add Page
        </Button>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {pages.map((page) => {
        // Example with default placeholder
        const thumbnail = 'https://placehold.co/400x200?text=Page+Preview';

        const title = page.title || page.name || 'Untitled Page';

        return (
            <Col key={page.id}>
            <Card
                className="h-100 shadow-sm position-relative"
                role="button"
                onClick={() =>
                navigate(`/editor/${user?.id}/${websiteId}/${page.slug}`)
                }
            >
                <Card.Img
                variant="top"
                src={thumbnail}
                alt={`${title} thumbnail`}
                style={{ objectFit: 'cover', height: '150px' }}
                />
                <Card.Body className="text-center">
                <Card.Title className="fw-semibold fs-5 text-truncate">
                    {title}
                </Card.Title>
                </Card.Body>

                <Button
                variant="danger"
                size="sm"
                style={{ position: 'absolute', top: 10, right: 10 }}
                onClick={(e) => {
                    e.stopPropagation();
                    setPageToDelete(page);
                    setShowDeleteModal(true);
                }}
                >
                <Trash size={16} />
                </Button>
            </Card>
            </Col>
        );
        })}
      </Row>

      {/* Create Page Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Page</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="pageName">
              <Form.Label>Page Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. About Us"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCreateModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!pageName || creating}
            onClick={handleCreatePage}
          >
            {creating ? 'Creating...' : 'Create Page'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{' '}
          <strong>{pageToDelete?.title || pageToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={deleting}
            onClick={handleDeletePage}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
