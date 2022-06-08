import React from 'react';
import {IconType} from '..';

export const IconFlag: IconType = ({height = 16, width = 16, ...props}) => {
  return (
    <svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M8.98296 4.46859C8.93798 4.4183 8.91312 4.3532 8.91312 4.28573C8.91312 4.21827 8.93798 4.15316 8.98296 4.10288L11.2687 1.40573C11.3704 1.27878 11.4349 1.12614 11.455 0.964743C11.4752 0.803348 11.4503 0.639519 11.383 0.491447C11.3111 0.338753 11.1958 0.210667 11.0514 0.123245C10.9071 0.0358237 10.7401 -0.00704305 10.5715 1.85559e-05H1.42868C1.20227 0.00297852 0.985966 0.0942347 0.825858 0.254343C0.665749 0.414451 0.574493 0.630753 0.571533 0.857161V15.1429C0.571533 15.3702 0.661839 15.5882 0.822584 15.749C0.98333 15.9097 1.20135 16 1.42868 16C1.656 16 1.87402 15.9097 2.03477 15.749C2.19551 15.5882 2.28582 15.3702 2.28582 15.1429V8.85716C2.28582 8.78139 2.31592 8.70871 2.3695 8.65513C2.42308 8.60155 2.49576 8.57145 2.57153 8.57145H10.5715C10.7344 8.57181 10.8939 8.52579 11.0316 8.43876C11.1692 8.35173 11.2792 8.22729 11.3487 8.08002C11.416 7.93195 11.4409 7.76812 11.4208 7.60672C11.4006 7.44533 11.3361 7.29268 11.2344 7.16573L8.98296 4.46859Z"
        fill="currentColor"
      />
    </svg>
  );
};