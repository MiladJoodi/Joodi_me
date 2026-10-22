"use client"

import * as React from "react"
import { ArrowDownIcon } from "lucide-react"

import { Button } from "@sonojs/ui/components/button"
import { cn } from "@sonojs/ui/lib/utils"

type MessageScrollerDefaultScrollPosition = "start" | "end" | "last-anchor"
type MessageScrollerButtonDirection = "start" | "end"
type MessageScrollerScrollAlign = "start" | "center" | "end" | "nearest"

type MessageScrollerScrollOptions = {
 align?: MessageScrollerScrollAlign
 behavior?: ScrollBehavior
 scrollMargin?: number
}

type MessageScrollerScrollable = {
 start: boolean
 end: boolean
}

type MessageScrollerVisibilityState = {
 currentAnchorId: string | null
 visibleMessageIds: string[]
}

type ItemRecord = {
 id: string | undefined
 element: HTMLElement
 scrollAnchor: boolean
}

type MessageScrollerContextValue = {
 autoScroll: boolean
 defaultScrollPosition: MessageScrollerDefaultScrollPosition
 scrollEdgeThreshold: number
 scrollPreviousItemPeek: number
 scrollMargin: number
 viewportRef: React.RefObject<HTMLDivElement | null>
 rootRef: React.RefObject<HTMLDivElement | null>
 registerItem: (record: ItemRecord) => () => void
 scrollToEnd: (options?: MessageScrollerScrollOptions) => boolean
 scrollToStart: (options?: MessageScrollerScrollOptions) => boolean
 scrollToMessage: (
 messageId: string,
 options?: MessageScrollerScrollOptions
 ) => boolean
 scrollable: MessageScrollerScrollable
 setScrollable: React.Dispatch<React.SetStateAction<MessageScrollerScrollable>>
 visibility: MessageScrollerVisibilityState
 setVisibility: React.Dispatch<
 React.SetStateAction<MessageScrollerVisibilityState>
 >
 visibilitySubscribers: React.MutableRefObject<number>
 following: React.MutableRefObject<boolean>
 pendingScroll: React.MutableRefObject<boolean>
 autoscrolling: React.MutableRefObject<boolean>
 queuedMessageId: React.MutableRefObject<string | null>
 releaseFollow: () => void
 syncScrollAttributes: () => void
 measureScrollable: () => void
 applyDefaultPosition: () => void
 itemsRef: React.MutableRefObject<Map<HTMLElement, ItemRecord>>
}

const MessageScrollerContext =
 React.createContext<MessageScrollerContextValue | null>(null)

function useMessageScrollerContext(hook: string) {
 const context = React.useContext(MessageScrollerContext)
 if (!context) {
 throw new Error(`${hook} must be used within MessageScrollerProvider`)
 }
 return context
}

function useMessageScroller() {
 const context = useMessageScrollerContext("useMessageScroller")
 return {
 scrollToEnd: context.scrollToEnd,
 scrollToStart: context.scrollToStart,
 scrollToMessage: context.scrollToMessage,
 }
}

function useMessageScrollerScrollable(): MessageScrollerScrollable {
 const context = useMessageScrollerContext("useMessageScrollerScrollable")
 return context.scrollable
}

function useMessageScrollerVisibility(): MessageScrollerVisibilityState {
 const context = useMessageScrollerContext("useMessageScrollerVisibility")

 React.useEffect(() => {
 context.visibilitySubscribers.current += 1
 return () => {
 context.visibilitySubscribers.current = Math.max(
 0,
 context.visibilitySubscribers.current - 1
 )
 }
 }, [context])

 return context.visibility
}

function isNearEnd(viewport: HTMLElement, threshold: number) {
 return (
 viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <=
 threshold
 )
}

function isNearStart(viewport: HTMLElement, threshold: number) {
 return viewport.scrollTop <= threshold
}

function MessageScrollerProvider({
 children,
 autoScroll = false,
 defaultScrollPosition = "end",
 scrollEdgeThreshold = 40,
 scrollPreviousItemPeek = 48,
 scrollMargin = 0,
}: {
 children?: React.ReactNode
 autoScroll?: boolean
 defaultScrollPosition?: MessageScrollerDefaultScrollPosition
 scrollEdgeThreshold?: number
 scrollPreviousItemPeek?: number
 scrollMargin?: number
}) {
 const viewportRef = React.useRef<HTMLDivElement | null>(null)
 const rootRef = React.useRef<HTMLDivElement | null>(null)
 const itemsRef = React.useRef(new Map<HTMLElement, ItemRecord>())
 const following = React.useRef(autoScroll)
 const pendingScroll = React.useRef(
 defaultScrollPosition === "end" || defaultScrollPosition === "last-anchor"
 )
 const autoscrolling = React.useRef(false)
 const queuedMessageId = React.useRef<string | null>(null)
 const visibilitySubscribers = React.useRef(0)
 const appliedDefault = React.useRef(false)

 const [scrollable, setScrollable] = React.useState<MessageScrollerScrollable>(
 { start: false, end: false }
 )
 const [visibility, setVisibility] =
 React.useState<MessageScrollerVisibilityState>({
 currentAnchorId: null,
 visibleMessageIds: [],
 })

 const syncScrollAttributes = React.useCallback(() => {
 const viewport = viewportRef.current
 const root = rootRef.current
 if (!viewport) return

 if (pendingScroll.current) {
 viewport.setAttribute("data-pending-scroll", "")
 } else {
 viewport.removeAttribute("data-pending-scroll")
 }

 if (autoscrolling.current) {
 viewport.setAttribute("data-autoscrolling", "")
 root?.setAttribute("data-autoscrolling", "")
 } else {
 viewport.removeAttribute("data-autoscrolling")
 root?.removeAttribute("data-autoscrolling")
 }

 const canStart = !isNearStart(viewport, scrollEdgeThreshold)
 const canEnd = !isNearEnd(viewport, scrollEdgeThreshold)
 root?.setAttribute(
 "data-scrollable",
 [canStart && "start", canEnd && "end"].filter(Boolean).join(" ") || "none"
 )
 }, [scrollEdgeThreshold])

 const measureScrollable = React.useCallback(() => {
 const viewport = viewportRef.current
 if (!viewport) return
 const next = {
 start: !isNearStart(viewport, scrollEdgeThreshold),
 end: !isNearEnd(viewport, scrollEdgeThreshold),
 }
 setScrollable((prev) =>
 prev.start === next.start && prev.end === next.end ? prev : next
 )
 syncScrollAttributes()
 }, [scrollEdgeThreshold, syncScrollAttributes])

 const releaseFollow = React.useCallback(() => {
 following.current = false
 }, [])

 const scrollToStart = React.useCallback(
 (options?: MessageScrollerScrollOptions) => {
 const viewport = viewportRef.current
 if (!viewport) return false
 releaseFollow()
 viewport.scrollTo({
 top: 0,
 behavior: options?.behavior ?? "smooth",
 })
 return true
 },
 [releaseFollow]
 )

 const scrollToEnd = React.useCallback(
 (options?: MessageScrollerScrollOptions) => {
 const viewport = viewportRef.current
 if (!viewport) return false
 if (autoScroll) following.current = true
 autoscrolling.current = true
 syncScrollAttributes()
 viewport.scrollTo({
 top: viewport.scrollHeight,
 behavior: options?.behavior ?? "smooth",
 })
 window.setTimeout(() => {
 autoscrolling.current = false
 syncScrollAttributes()
 measureScrollable()
 }, 400)
 return true
 },
 [autoScroll, measureScrollable, syncScrollAttributes]
 )

 const scrollToMessage = React.useCallback(
 (messageId: string, options?: MessageScrollerScrollOptions) => {
 const viewport = viewportRef.current
 if (!viewport) {
 queuedMessageId.current = messageId
 return true
 }

 const entry = [...itemsRef.current.values()].find(
 (item) => item.id === messageId
 )
 if (!entry) {
 queuedMessageId.current = messageId
 return false
 }

 releaseFollow()
 const align = options?.align ?? "start"
 const margin = options?.scrollMargin ?? scrollMargin
 const top =
 entry.element.offsetTop -
 (align === "center"
 ? (viewport.clientHeight - entry.element.offsetHeight) / 2
 : align === "end"
 ? viewport.clientHeight - entry.element.offsetHeight
 : 0) -
 margin

 viewport.scrollTo({
 top: Math.max(0, top),
 behavior: options?.behavior ?? "smooth",
 })
 return true
 },
 [releaseFollow, scrollMargin]
 )

 const applyDefaultPosition = React.useCallback(() => {
 const viewport = viewportRef.current
 if (!viewport || appliedDefault.current) return

 if (defaultScrollPosition === "start") {
 viewport.scrollTop = 0
 pendingScroll.current = false
 appliedDefault.current = true
 following.current = false
 syncScrollAttributes()
 measureScrollable()
 return
 }

 if (defaultScrollPosition === "last-anchor") {
 const anchors = [...itemsRef.current.values()].filter(
 (item) => item.scrollAnchor
 )
 const last = anchors.at(-1)
 if (last) {
 const top = Math.max(
 0,
 last.element.offsetTop - scrollPreviousItemPeek
 )
 viewport.scrollTop = top
 pendingScroll.current = false
 appliedDefault.current = true
 following.current = false
 syncScrollAttributes()
 measureScrollable()
 return
 }
 }

 viewport.scrollTop = viewport.scrollHeight
 pendingScroll.current = false
 appliedDefault.current = true
 following.current = autoScroll
 syncScrollAttributes()
 measureScrollable()
 }, [
 autoScroll,
 defaultScrollPosition,
 measureScrollable,
 scrollPreviousItemPeek,
 syncScrollAttributes,
 ])

 const updateVisibility = React.useCallback(() => {
 if (visibilitySubscribers.current === 0) return
 const viewport = viewportRef.current
 if (!viewport) return

 const viewTop = viewport.scrollTop
 const viewBottom = viewTop + viewport.clientHeight
 const visible: string[] = []
 let currentAnchorId: string | null = null

 const ordered = [...itemsRef.current.values()].sort(
 (a, b) => a.element.offsetTop - b.element.offsetTop
 )

 for (const item of ordered) {
 if (!item.id) continue
 const top = item.element.offsetTop
 const bottom = top + item.element.offsetHeight
 if (bottom >= viewTop && top <= viewBottom) {
 visible.push(item.id)
 }
 if (item.scrollAnchor && top <= viewTop + scrollPreviousItemPeek + 8) {
 currentAnchorId = item.id
 }
 }

 setVisibility((prev) => {
 const sameIds =
 prev.visibleMessageIds.length === visible.length &&
 prev.visibleMessageIds.every((id, i) => id === visible[i])
 if (sameIds && prev.currentAnchorId === currentAnchorId) return prev
 return { currentAnchorId, visibleMessageIds: visible }
 })
 }, [scrollPreviousItemPeek])

 const registerItem = React.useCallback(
 (record: ItemRecord) => {
 itemsRef.current.set(record.element, record)

 if (queuedMessageId.current && record.id === queuedMessageId.current) {
 const id = queuedMessageId.current
 queuedMessageId.current = null
 requestAnimationFrame(() => {
 scrollToMessage(id, { behavior: "auto" })
 })
 }

 if (
 record.scrollAnchor &&
 appliedDefault.current &&
 !pendingScroll.current
 ) {
 const viewport = viewportRef.current
 if (viewport) {
 const top = Math.max(
 0,
 record.element.offsetTop - scrollPreviousItemPeek
 )
 viewport.scrollTo({ top, behavior: "smooth" })
 following.current = false
 }
 }

 requestAnimationFrame(() => {
 if (!appliedDefault.current) applyDefaultPosition()
 if (autoScroll && following.current && viewportRef.current) {
 viewportRef.current.scrollTop = viewportRef.current.scrollHeight
 }
 measureScrollable()
 updateVisibility()
 })

 return () => {
 itemsRef.current.delete(record.element)
 }
 },
 [
 applyDefaultPosition,
 autoScroll,
 measureScrollable,
 scrollPreviousItemPeek,
 scrollToMessage,
 updateVisibility,
 ]
 )

 const value = React.useMemo<MessageScrollerContextValue>(
 () => ({
 autoScroll,
 defaultScrollPosition,
 scrollEdgeThreshold,
 scrollPreviousItemPeek,
 scrollMargin,
 viewportRef,
 rootRef,
 registerItem,
 scrollToEnd,
 scrollToStart,
 scrollToMessage,
 scrollable,
 setScrollable,
 visibility,
 setVisibility,
 visibilitySubscribers,
 following,
 pendingScroll,
 autoscrolling,
 queuedMessageId,
 releaseFollow,
 syncScrollAttributes,
 measureScrollable,
 applyDefaultPosition,
 itemsRef,
 }),
 [
 autoScroll,
 applyDefaultPosition,
 defaultScrollPosition,
 measureScrollable,
 registerItem,
 releaseFollow,
 scrollEdgeThreshold,
 scrollMargin,
 scrollPreviousItemPeek,
 scrollToEnd,
 scrollToMessage,
 scrollToStart,
 scrollable,
 syncScrollAttributes,
 visibility,
 ]
 )

 return (
 <MessageScrollerContext.Provider value={value}>
 {children}
 </MessageScrollerContext.Provider>
 )
}

function MessageScroller({
 className,
 ...props
}: React.ComponentProps<"div">) {
 const context = useMessageScrollerContext("MessageScroller")

 return (
 <div
 ref={context.rootRef}
 data-slot="message-scroller"
 className={cn(
 "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
 className
 )}
 {...props}
 />
 )
}

function MessageScrollerViewport({
 className,
 preserveScrollOnPrepend = true,
 onScroll,
 onWheel,
 onTouchMove,
 onKeyDown,
 ...props
}: React.ComponentProps<"div"> & {
 preserveScrollOnPrepend?: boolean
}) {
 const context = useMessageScrollerContext("MessageScrollerViewport")
 const prependSnapshot = React.useRef<{
 height: number
 top: number
 } | null>(null)

 React.useEffect(() => {
 const viewport = context.viewportRef.current
 if (!viewport) return

 context.applyDefaultPosition()
 context.measureScrollable()

 const resizeObserver = new ResizeObserver(() => {
 if (
 preserveScrollOnPrepend &&
 prependSnapshot.current &&
 viewport.scrollHeight > prependSnapshot.current.height
 ) {
 const delta =
 viewport.scrollHeight - prependSnapshot.current.height
 viewport.scrollTop = prependSnapshot.current.top + delta
 prependSnapshot.current = null
 }

 if (context.autoScroll && context.following.current) {
 viewport.scrollTop = viewport.scrollHeight
 }
 context.measureScrollable()
 if (context.visibilitySubscribers.current > 0) {
 // visibility updated via scroll path; force a pass after size changes
 viewport.dispatchEvent(new Event("scroll"))
 }
 })

 const content = viewport.firstElementChild
 if (content) resizeObserver.observe(content)
 resizeObserver.observe(viewport)

 return () => resizeObserver.disconnect()
 }, [context, preserveScrollOnPrepend])

 return (
 <div
 ref={context.viewportRef}
 data-slot="message-scroller-viewport"
 role="log"
 aria-label="Conversation"
 tabIndex={0}
 className={cn(
 "size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain contain-content outline-none data-autoscrolling:scrollbar-none data-pending-scroll:invisible",
 className
 )}
 onScroll={(event) => {
 const viewport = event.currentTarget
 if (preserveScrollOnPrepend) {
 prependSnapshot.current = {
 height: viewport.scrollHeight,
 top: viewport.scrollTop,
 }
 }

 if (
 context.autoScroll &&
 !context.autoscrolling.current &&
 !isNearEnd(viewport, context.scrollEdgeThreshold)
 ) {
 context.releaseFollow()
 } else if (
 context.autoScroll &&
 isNearEnd(viewport, context.scrollEdgeThreshold)
 ) {
 context.following.current = true
 }

 context.measureScrollable()
 if (context.visibilitySubscribers.current > 0) {
 const viewTop = viewport.scrollTop
 const viewBottom = viewTop + viewport.clientHeight
 const visible: string[] = []
 let currentAnchorId: string | null = null
 const ordered = [...context.itemsRef.current.values()].sort(
 (a, b) => a.element.offsetTop - b.element.offsetTop
 )
 for (const item of ordered) {
 if (!item.id) continue
 const top = item.element.offsetTop
 const bottom = top + item.element.offsetHeight
 if (bottom >= viewTop && top <= viewBottom) visible.push(item.id)
 if (
 item.scrollAnchor &&
 top <= viewTop + context.scrollPreviousItemPeek + 8
 ) {
 currentAnchorId = item.id
 }
 }
 context.setVisibility((prev) => {
 const sameIds =
 prev.visibleMessageIds.length === visible.length &&
 prev.visibleMessageIds.every((id, i) => id === visible[i])
 if (sameIds && prev.currentAnchorId === currentAnchorId) return prev
 return { currentAnchorId, visibleMessageIds: visible }
 })
 }
 onScroll?.(event)
 }}
 onWheel={(event) => {
 if (event.deltaY < 0) context.releaseFollow()
 onWheel?.(event)
 }}
 onTouchMove={(event) => {
 context.releaseFollow()
 onTouchMove?.(event)
 }}
 onKeyDown={(event) => {
 if (
 event.key === "PageUp" ||
 event.key === "Home" ||
 event.key === "ArrowUp"
 ) {
 context.releaseFollow()
 }
 onKeyDown?.(event)
 }}
 {...props}
 />
 )
}

function MessageScrollerContent({
 className,
 ...props
}: React.ComponentProps<"div">) {
 return (
 <div
 data-slot="message-scroller-content"
 className={cn("flex h-max min-h-full flex-col gap-6 p-4", className)}
 {...props}
 />
 )
}

function MessageScrollerItem({
 className,
 messageId,
 scrollAnchor = false,
 ...props
}: React.ComponentProps<"div"> & {
 messageId?: string
 scrollAnchor?: boolean
}) {
 const context = useMessageScrollerContext("MessageScrollerItem")
 const ref = React.useRef<HTMLDivElement | null>(null)

 React.useEffect(() => {
 const element = ref.current
 if (!element) return
 return context.registerItem({
 id: messageId,
 element,
 scrollAnchor,
 })
 }, [context, messageId, scrollAnchor])

 return (
 <div
 ref={ref}
 data-slot="message-scroller-item"
 data-message-id={messageId}
 data-scroll-anchor={scrollAnchor || undefined}
 className={cn(
 "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
 className
 )}
 {...props}
 />
 )
}

function MessageScrollerButton({
 direction = "end",
 className,
 children,
 variant = "secondary",
 size = "icon-sm",
 behavior = "smooth",
 ...props
}: React.ComponentProps<typeof Button> & {
 direction?: MessageScrollerButtonDirection
 behavior?: ScrollBehavior
}) {
 const context = useMessageScrollerContext("MessageScrollerButton")
 const active =
 direction === "end" ? context.scrollable.end : context.scrollable.start

 return (
 <Button
 type="button"
 variant={variant}
 size={size}
 data-slot="message-scroller-button"
 data-direction={direction}
 data-active={active}
 tabIndex={active ? 0 : -1}
 aria-hidden={!active}
 className={cn(
 "absolute start-1/2 z-10 -translate-x-1/2 border-border bg-background text-foreground shadow-md transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
 className
 )}
 onClick={() => {
 if (direction === "end") {
 context.scrollToEnd({ behavior })
 } else {
 context.scrollToStart({ behavior })
 }
 }}
 {...props}
 >
 {children ?? (
 <>
 <ArrowDownIcon />
 <span className="sr-only">
 {direction === "end" ? "Scroll to end" : "Scroll to start"}
 </span>
 </>
 )}
 </Button>
 )
}

export {
 MessageScrollerProvider,
 MessageScroller,
 MessageScrollerViewport,
 MessageScrollerContent,
 MessageScrollerItem,
 MessageScrollerButton,
 useMessageScroller,
 useMessageScrollerScrollable,
 useMessageScrollerVisibility,
}

export type {
 MessageScrollerDefaultScrollPosition,
 MessageScrollerScrollAlign,
 MessageScrollerScrollOptions,
 MessageScrollerScrollable,
 MessageScrollerVisibilityState,
}
