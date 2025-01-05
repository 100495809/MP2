import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListView from './ListView';
import GalleryView from './GalleryView';
import DetailsView from './DetailsView';

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          {/* No need for 'exact' in React Router v6 */}
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/details/:name" element={<DetailsView />} />
        </Routes>
      </Router>
  );
};

export default App;
