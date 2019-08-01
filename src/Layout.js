import React from "react";

import ListRecordsView from "../src/ListRecordsView";

import { Container, Row, Col } from "reactstrap";

import { withRouter } from "next/router";

export const _LeftCol = props =>
  (props.router.query.bucket && props.router.query.collection && (
    <ListRecordsView
      {...props.router.query}
      onAddClick={async ({ client }) => {
        const result = await client
          .bucket(props.router.query.bucket)
          .collection(props.router.query.collection)
          .createRecord({ title: "", refs: [{}] });

        props.router.push(
          `/bucket/${props.router.query.bucket}/collection/${props.router.query.collection}/record/${result.data.id}`
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
  )) ||
  null;

const LeftCol = withRouter(_LeftCol);

class Layout extends React.Component {
  state = {
    drawerOpen: !!this.props.LeftComponent
  };
  handleDrawerToggle = () => {
    this.setState(curState => ({ drawerOpen: !curState.drawerOpen }));
  };
  shouldComponentUpdate(nextProps) {
    return true;
  }
  render() {
    const { config, LeftComponent, RightComponent, children } = this.props;

    return (
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
  }
}

Layout.defaultProps = {
  //LeftComponent: withRouter(DefaultLeftComponent),
  RightComponent: null
};

export default Layout;
