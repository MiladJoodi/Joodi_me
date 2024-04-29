---
slug: vercel-custom-email
title: How to create free email forwarding for your vercel app custom domain
authors:
  name: Joodi
  title: Published in Linkedin
  url: https://www.linkedin.com/posts/miladjoodi_kinde-nextabrauth-nextjsabrauthentication-activity-7170461082841464832-LT0H/?utm_source=share&utm_medium=member_desktop
  image_url: https://avatars.githubusercontent.com/u/43522323?v=4
tags: [nextjs, nextjs14, improvmx ]
---
 During my day to day use, I missed having a personalized email service with my domain, for example info@joodi.me
I looked on the Vercel dashboard and saw that they didn't offer this type of service, so I started searching for third-party services and found **[ImprovMX](https://improvmx.com/)** .

What is ImprovMX?
ImprovMX offers an email forwarding service. What it basically does is catch all emails that arrive at your domain, for example, all emails that arrive at @joodi.me will be redirected to another email that I informed.

And you know the best?! It's free and has a very fast delivery capacity:

![](https://s30.picofile.com/file/8474852184/5555.JPG)

So let's learn how to do this?
The configuration process at ImprovMX is very quick and easy, just access their website which you can open by [clicking here](https://improvmx.com/) .

Right from the start you will come across this section where you enter your domain and the email to which you will be redirected:

![](https://s30.picofile.com/file/8474852068/im.JPG)

After filling in the data and clicking on Create a free alias you will be redirected to a screen like this, where it will show you the DNS settings necessary to complete the implementation:

![](https://s30.picofile.com/file/8474852242/s02.JPG)

Then just enter this DNS information into your domain provider to start the redirection, this DNS update process can take up to 48 hours to finish propagating.

Soon after the records are OK, you will see a screen like this:

![](https://s31.picofile.com/file/8474852276/sdsdsd.JPG)

And if everything is ok, all your emails will be redirected!

✅ Thanks for reading!

[Source](https://vinniciusgomes.medium.com/como-criar-aliases-de-e-mails-gratuitos-para-seu-dom%C3%ADnio-7dfd52fdcadd)