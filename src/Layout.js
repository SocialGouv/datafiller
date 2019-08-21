import React from "react";

import ListRecordsView from "../src/ListRecordsView";

import { Container, Row, Col } from "reactstrap";

import { withRouter } from "next/router";

const TreeRecordsView = () => <div>io</div>;

const leftComponents = {
  themes: TreeRecordsView,
  default: ListRecordsView
};

export const _LeftCol = props => {
  const LeftComponent =
    leftComponents[props.router.query.collection] || leftComponents.default;
  if (props.router.query.bucket && props.router.query.collection) {
    return (
      <LeftComponent
        {...props.router.query}
        onAddClick={async ({ client }) => {
          const defaultRecordData = {
            requetes: { title: "", intro: "", theme: null, refs: [{}] },
            ccns: { title: "", groups: {}, intro: "" }
          };
          const result = await client
            .bucket(props.router.query.bucket, { headers: {} })
            .collection(props.router.query.collection, { headers: {} })
            .createRecord(defaultRecordData[props.router.query.collection], {
              headers: {}
            });

          props.router.push(
            `/bucket/${props.router.query.bucket}/collection/${
              props.router.query.collection
            }/record/${result.data.id}`
          );

          // hack
          setTimeout(() => {
            const target = document.querySelector("textarea[name='title']");
            if (target) {
              target.focus();
            }
          }, 200);
        }}
        intro="Restant à compléter"
      />
    );
  }
  return null;
};

const LeftCol = withRouter(_LeftCol);

const Layout = ({ RightComponent, children }) => (
  <Row>
    <Col xs={3}>
      <LeftCol />
    </Col>
    <Col xs={9}>
      <Container>
        {RightComponent && <RightComponent />}
        {children}
      </Container>
    </Col>
  </Row>
);

Layout.defaultProps = {
  //LeftComponent: withRouter(DefaultLeftComponent),
  RightComponent: null
};

export default Layout;
