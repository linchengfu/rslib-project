import * as React from "react";
import type { SVGProps } from "react";
const PieChart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      fill="#000"
      d="M16 2.38c7.522 0 13.62 6.099 13.62 13.621S23.523 29.622 16 29.622 2.38 23.525 2.38 16.002C2.38 8.478 8.478 2.38 16 2.38m0 1c-6.97 0-12.62 5.651-12.62 12.621S9.03 28.622 16 28.622s12.62-5.65 12.62-12.62S22.97 3.38 16 3.38m0 3.234a9.388 9.388 0 0 1 9.325 10.453H14.934V6.674q.525-.06 1.066-.06"
    />
  </svg>
);
export default PieChart;
