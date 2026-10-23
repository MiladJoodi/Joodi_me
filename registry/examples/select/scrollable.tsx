"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@sonojs/ui/components/select"

export function SelectScrollable() {
  return (
    <Select>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Timezone" />
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="bottom"
        avoidCollisions={false}
        className="max-h-48 w-44"
      >
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern (EST)</SelectItem>
          <SelectItem value="cst">Central (CST)</SelectItem>
          <SelectItem value="mst">Mountain (MST)</SelectItem>
          <SelectItem value="pst">Pacific (PST)</SelectItem>
          <SelectItem value="akst">Alaska (AKST)</SelectItem>
          <SelectItem value="hst">Hawaii (HST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">GMT</SelectItem>
          <SelectItem value="cet">Central (CET)</SelectItem>
          <SelectItem value="eet">Eastern (EET)</SelectItem>
          <SelectItem value="west">Western Summer</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="ist">India (IST)</SelectItem>
          <SelectItem value="cst_china">China (CST)</SelectItem>
          <SelectItem value="jst">Japan (JST)</SelectItem>
          <SelectItem value="kst">Korea (KST)</SelectItem>
          <SelectItem value="msk">Moscow (MSK)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Pacific</SelectLabel>
          <SelectItem value="aest">Australia East</SelectItem>
          <SelectItem value="awst">Australia West</SelectItem>
          <SelectItem value="nzst">New Zealand</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
