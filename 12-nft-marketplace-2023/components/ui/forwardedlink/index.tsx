import Link from "next/link";
import { forwardRef, ForwardRefRenderFunction } from "react";

type ForwardedLinkProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
};

const ForwardedLink: ForwardRefRenderFunction<HTMLAnchorElement, ForwardedLinkProps> = (
    { href, children, className },
    ref
) => (
    <Link href={href}>
        <a ref={ref} className={className}>
            {children}
        </a>
    </Link>
);

export default forwardRef(ForwardedLink);
