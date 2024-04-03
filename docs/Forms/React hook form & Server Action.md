---
sidebar_position: 3
---

# Form Validation React Hook Form & Server Action

Don't forget "use client" for form component


![title](https://s30.picofile.com/file/8474046318/form.JPG)

Create a file at `forms/Register.tsx`:

```tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { registerUser } from "@/actions/user2";

export interface UserInput {
  name: string;
  email: string;
}

 const RegisterForm:React.FC = ()=> {
  // React Hook Form Start
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UserInput>();

  const sleep = (ms:number) => new Promise(response => setTimeout(response, ms));

  const onSubmit = async (data: UserInput) => {
    await sleep(5000)
    await registerUser(data) 
    console.log(data);
  };

  // React Hook Form End

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" flex flex-col gap-3  w-full shadow-lg p-6  rounded-md"
    >
      <div className="flex flex-col gap-1">
        <Input
          {...register("name", {
            required: "Sorry, name is required",
            minLength: 2,
            maxLength: 20,
          })}
          type="text"
          placeholder="Your ame"
        />
        {errors.name && errors.name.type === "required" && (
          <p className="text-red-500">{errors.name?.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
      <Input
        {...register("email", {
          required: "Please enter your email",
          minLength: 5,
          maxLength: 20,
        })}
        type="email"
        placeholder="Your email"
      />
        {errors.email && errors.email.type === "required" && (
          <p className="text-red-500">{errors.email?.message}</p>
        )}
      </div>

      <Button>Submit</Button>
    </form>
  );
}

export default RegisterForm;

```


Next.js Server Action: `actions.ts`
```tsx
"use server"

export interface UserInput {
    name: string;
    email: string;
  }

// Register
export const registerUser = async (formData: UserInput) => {
    console.log(formData)
}
```


![title](https://s30.picofile.com/file/8474046368/form2.JPG)



