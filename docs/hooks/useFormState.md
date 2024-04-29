---
sidebar_position: 3
---

# useFormState

useFormState and show toast in Next.js, Server Action with shadcn <br />

We will need two things to start, a form, to post to the form action, and the server action that will receive the data from the form, process it and return the result.

#### Form Actions
Let’s start on the server side first. To create a server action we create another module in our application, for example `action.ts`  and in that file we define a server action like so:

```tex
"use server";

type FormState = {
  message: string;
}

export async function onFormPostAction(prevState: FormState, data: FormData) {
   // Process the data
   return {
      message: "Form data processed";
   }
}
```
The server action function onFormPostAction needs to be defined as an async function. It also need to either have "use server" as the first line of the function, or "use server" needs to be at the top of the module file, as it is here. In the second case it means that all of the functions in the file are server only functions.

To use the useFormState hook on the client your action also needs to have a specific signature. With the previous state being the first argument, and the form data as the second argument. The shape of the form state is up to you, ours just has a message in it. Both the previous state and the return from the post action function should be the same type.

Now let’s try this out on the client.

#### useFormState On The Client
To use our form action on the client we need to import that action function from `action.ts` and send it to the `useFormState` function from react-dom, like so:

```tsx
"use client";
import { useFormState } from "react-dom";

import { onFormPostAction } from "./formPostAction.ts";

export default function MyForm() {
  const [state, action] = useFormState(onFormPostAction, {
    message: "",
  });
   // ...
}
```
Right at the top of this file we can see that this is going to be a client component because there is a "use client"; directive. We need that so that we can use the useFormState hook.

Then in the body of the component we invoke useFormState and give it two things; the server action function, and the initial state. The initial state object needs to match the type of the FormState type in formPostAction.ts .

What comes out is a tuple with the current state and an action function. On the initial render that state value will match the initial state. But after a form post the state will be whatever came back from the server.

The action function is what we send to the form tag. Like so:

```tsx
export default function MyForm() {
  const [state, action] = useFormState(...);
  const [first, setFirst] = useState("");
   
  return (
    <form action={action}>
       <input
          type="text" name="first"
          value={first} onChange={(e) => setFirst(e.target.value)}
       />
       <button type="submit">Submit</button>
    </form>
  );
}
```
ow we’ve added a form tag that takes has the action property defined with the action function returned from useFormState. It also has an input field for a first name that use standard useState state, as well as a submit button.

This is enough to try out this system. On first render we get a blank first name field that we can then populate. Hitting the submit button we send that data to the server action as the form data, and we get back the returned message as state.

We can display that state easily by simply adding it to the JSX.

```tsx
  return (
    <form action={action}>
      <div>{state.message}</div>
      ...
    </form>
  );

```

show Toast with Shadcn

     useEffect(()=> {
        if(state.message === "success"){
            toast({
                title: "Hooray 🍕",
                description: "Todo Edited!"
            })
        }
        if(state.message === "empty"){
            toast({
                title: "Empty ❌",
                description: "It's Empty!"
            })
        }
    }, [state])
    


![title](https://s30.picofile.com/file/8474843800/ererer.JPG)


