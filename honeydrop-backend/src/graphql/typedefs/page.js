import gql from 'graphql-tag';

const pageTypeDefs = gql`
  type SEO {
    title: String
    description: String
  }

  type Page {
    id: ID!
    site: Website!
    title: String!
    slug: String!
    path: String
    isHomepage: Boolean
    isPublished: Boolean
    seo: SEO
    sections: [Section!]!
    createdAt: String
    updatedAt: String
  }

  input SEOInput {
    title: String
    description: String
  }

  input CreatePageInput {
    site: ID!
    title: String!
    slug: String!
    path: String
    isHomepage: Boolean
    isPublished: Boolean
    seo: SEOInput
    sections: [SectionInput]
  }

  input UpdatePageInput {
    title: String
    slug: String
    path: String
    isHomepage: Boolean
    isPublished: Boolean
    seo: SEOInput
    sections: [SectionInput]
  }

  type Query {
    getPagesBySite(siteId: ID!): [Page!]!
    getPageById(id: ID!): Page
  }

  type Mutation {
    createPage(input: CreatePageInput!): Page!
    updatePage(id: ID!, input: UpdatePageInput!): Page!
    deletePage(id: ID!): Boolean!
  }

  #sections
  scalar JSON

    type SectionElement {
    id: ID!
    type: String!     # "heading", "paragraph", "image", "div", "component"
    tag: String       # For headings or divs (e.g., h1-h6, section, etc.)
    text: String
    src: String       # For image/video
    alt: String
    styles: JSON
    }

    type Section {
    id: ID!
    type: String!     # "hero", "gallery", "custom", etc.
    settings: JSON
    content: [SectionElement!]!
    }

    extend type Page {
    sections: [Section!]!
    }

    input SectionElementInput {
    id: ID
    type: String!
    tag: String
    text: String
    src: String
    alt: String
    styles: JSON
    }

    input SectionInput {
    id: ID
    type: String!
    settings: JSON
    content: [SectionElementInput!]!
    }
`;

export default pageTypeDefs;
