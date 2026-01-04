
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type SidebarContext = {
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(!isMobile)
  const [openMobile, setOpenMobile] = React.useState(false)

  const toggleSidebar = React.useCallback(() => {
    isMobile ? setOpenMobile((prev) => !prev) : setOpen((prev) => !prev)
  }, [isMobile])

  React.useEffect(() => {
    setOpen(!isMobile)
  }, [isMobile])

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div className={cn("flex min-h-screen w-full", className)} ref={ref} {...props}>
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = "SidebarProvider"


const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    const { isMobile, openMobile, setOpenMobile } = useSidebar()

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent className="w-[280px] bg-sidebar p-0 text-sidebar-foreground flex flex-col" side="left">
            {children}
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div ref={ref} className={cn("sidebar hidden sm:flex flex-col h-full", className)} {...props}>
        {children}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-4 overflow-hidden p-2 text-left text-sm outline-none ring-ring transition-colors focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: React.ReactNode
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { open } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ variant }),
          !open && "justify-center",
          "nav-item",
          isActive && "active",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )

    if (!tooltip || open) {
      return button
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" align="center">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex w-full min-w-0 flex-col gap-1 py-2", className)} {...props} />
  )
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("group/menu-item relative", className)} {...props} />
  )
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const { open } = useSidebar()
    return (
      <div
        ref={ref}
        className={cn(
          "nav-header flex h-8 shrink-0 items-center px-4 text-xs font-medium text-muted-foreground",
          !open && "hidden",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { label?: string }>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative flex w-full min-w-0 flex-col", className)} {...props}>
        {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
        {children}
      </div>
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarSeparator = React.forwardRef<HTMLHRElement, React.ComponentProps<"hr">>(
  ({ className, ...props }, ref) => <hr ref={ref} className={cn("my-2 border-border", className)} {...props} />
)
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-2", className)} {...props} />
  )
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-2 mt-auto", className)} {...props} />
  )
)
SidebarFooter.displayName = "SidebarFooter"

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
}
