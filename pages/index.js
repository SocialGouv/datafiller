import React from "react";

import Layout from "../src/Layout";

const Index = () => (
  <Layout
    RightComponent={() => (
      <div>Choisissez un terme de recherche pour éditer les résultats</div>
    )}
  />
);

export default Index;
