import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function UserButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="size-8">
          <AvatarImage src="/image/avatar.jpg" />
          <AvatarFallback>MB</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>hello world</PopoverContent>
    </Popover>
  );
}

export default UserButton;
