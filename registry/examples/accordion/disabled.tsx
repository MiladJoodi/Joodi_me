import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@winkui/ui/components/accordion"

export function AccordionDisabled() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-lg">
      <AccordionItem value="item-1">
        <AccordionTrigger>Can I access my account history?</AccordionTrigger>
        <AccordionContent>
          Yes. You can view transactions, plan changes, and support tickets in
          the Account History section of your dashboard.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Premium feature information</AccordionTrigger>
        <AccordionContent>
          This section contains information about premium features. Upgrade your
          plan to access this content.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How do I update my email address?</AccordionTrigger>
        <AccordionContent>
          Update your email in account settings. You will receive a verification
          email at the new address to confirm the change.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
