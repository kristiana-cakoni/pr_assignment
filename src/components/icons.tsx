import type { ReactNode, SVGProps } from "react";

export type IconName = "grid" | "home" | "box" | "cart" | "search" | "menu";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

const paths: Record<IconName, ReactNode> = {
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
    </>
  ),
  home: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />,
  box: (
    <>
      <path d="M3.5 8 12 4l8.5 4L12 12z" />
      <path d="M3.5 8v8L12 20l8.5-4V8" />
      <path d="M12 12v8" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="19" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="19" r="1.2" fill="currentColor" stroke="none" />
      <path d="M3 5h2l2.2 9.2a1 1 0 0 0 1 .8H17a1 1 0 0 0 1-.8L19.5 8H7" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
};

export function Icon({ name, className, width = 20, height = 20, ...props }: IconProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      width={width}
      height={height}
      className={className ? `icon ${className}` : "icon"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
