import { Children, cloneElement, forwardRef, isValidElement, type ButtonHTMLAttributes, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { isSplitPrimary, SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';

const buttonVariants = cva(
  // uat R160 (run 6): rounded-lg IS the control radius (--radius); rounded-md sat 2px under it, so a
  // Button and an Input never quite matched. The chrome kit and the design contract pin rounded-lg.
  // 2026-09-24 (run 12b, Kestrel): the icon rules shadcn ships. A label and its icon sit on one
  // flex row with a fixed gap; an svg never wraps, never shrinks and never eats the click, and an
  // unsized icon is 16px. An author's `<ArrowRight size={16} />` after the label needs nothing else.
  "ef-button-face inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-10 rounded-lg px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render the single child (a router <Link>, an <a>) AS the button: it receives the button classes
   * and props instead of being nested inside a <button>. This is shadcn's `asChild` contract, which
   * every model reaches for by reflex; before 2026-09-24 the template silently ignored it, so
   * `<Button asChild><Link>label <ArrowRight/></Link></Button>` rendered an anchor inside a button,
   * React warned about the unknown `asChild` DOM attribute, and the icon (display:block under the
   * Tailwind preflight, inside an inline anchor) dropped onto its own line under the label.
   */
  asChild?: boolean;
  /** Default red buttons use the two-part arrow. Set false for a plain red control, such as the shimmer CTA. */
  split?: boolean;
}

type SlotChild = ReactElement<{ className?: string; style?: CSSProperties; children?: ReactNode } & Record<string, unknown>>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, split = true, children, style, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    const useSplit = split && (variant ?? 'default') === 'default' && isSplitPrimary(classes, size);
    const splitStyle = useSplit ? { ...splitPrimaryStyle(classes, size), ...style } : style;
    if (asChild && isValidElement(children)) {
      // A dependency-free Slot: the child keeps its own props (they win over ours, as in Radix), the
      // class lists merge, and the ref reaches the child's DOM node.
      const child = Children.only(children) as SlotChild;
      const childClass = cn(classes, child.props.className);
      const childSplit = split && (variant ?? 'default') === 'default' && isSplitPrimary(childClass, size);
      return cloneElement(
        child,
        {
          ...props,
          ...child.props,
          className: cn(childClass, childSplit && SPLIT_PRIMARY),
          style: childSplit ? { ...splitPrimaryStyle(childClass, size), ...child.props.style, ...style } : child.props.style,
          ref,
        } as Record<string, unknown>,
        childSplit ? <SplitPrimaryParts>{child.props.children}</SplitPrimaryParts> : child.props.children,
      );
    }
    return (
      <button className={cn(classes, useSplit && SPLIT_PRIMARY)} ref={ref} style={splitStyle} {...props}>
        {useSplit ? <SplitPrimaryParts>{children}</SplitPrimaryParts> : children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
