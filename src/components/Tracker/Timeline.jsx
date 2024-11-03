import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Badge } from 'reactstrap';

const Timeline = ({ productStages, initialKey }) => {
  const [expandedKey, setExpandedKey] = useState(null);

  const getStages = (startKey) => {
    const stages = [];
    const queue = [startKey];
    const visitedSet = new Set();

    while (queue.length > 0) {
      const key = queue.shift();
      if (!productStages[key] || visitedSet.has(key)) continue;
      visitedSet.add(key);
      stages.push(key);

      productStages[key].forEach((neighbor) => {
        queue.push(neighbor.OutputProducts);
      });
    }

    return stages;
  };

  const stages = getStages(initialKey);

  const handleExpand = (key) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      <div className="timeline-event-container">
        {stages.map((key, index) => (
          <div className={`timeline-event ${index % 2 === 0 ? 'top' : 'bottom'}`} key={key}>
            <div className="timeline-vertical-line"></div>
            <div
              className="timeline-circle"
              onClick={() => handleExpand(key)}
              title={`Click to see details of ${key}`}
            >
              <span className="tick-icon">+</span>
            </div>
            <p
              className="timeline-label text-white mb-3"
              onClick={() => handleExpand(key)}
              style={{ cursor: 'pointer' }}
            >
              {key}
            </p>
       {expandedKey === key && (
          <div className={`event-details ${index % 2 === 0 ? 'details-below' : 'details-above'}`}>
            <div className="event-heading">
            <Badge color="info">{productStages[key][0].EventType.toUpperCase()}</Badge>
            </div>
            {productStages[key].map((neighbor, idx) => (
              <Card key={idx} className="text-left colorful-card">
                <CardBody>
                  <h5 className="mb-1 font-weight-bold text-primary">{neighbor.Name}</h5>
                  <p className="byproducts-text mb-0">
                    {
                      neighbor.ByProducts? <span><strong>By-products:</strong> {neighbor.ByProducts}</span>:<span>No By-products Available</span>
                    }
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}


          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
