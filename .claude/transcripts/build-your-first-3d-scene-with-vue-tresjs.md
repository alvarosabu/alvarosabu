
Making 3D websites with Threejs 

Dont get me wrong, I do enjoy it

Adding objects

Animating objects

Adding a camera

and maybe why not, post processing

its all really fun,

but it can get a little bit overwhelming specially if you specially if you are trying to use it with your favorite framework.

So, I'm going to show you how I developer 3D experiences, with Vue.

Okay, let's do

install Tres in your Vue project, but I actually prefer to bootstrap it using the Create CLI, because it gets everything out of the box.

Let me show you how it's done.

(...)

Open the terminal and then let's use the command "pnpm create tras" and the name of your project. In this case I'm gonna choose my tras.js project, hit enter and it's gonna ask you which templates do you want to use. So we have two options, we have "view" with the latest version and "using vid" and also we have "nux" with the latest

nux module. Ok, so for now we're gonna use Vue then it's gonna ask you if you want to use "yes lint" which is a good idea so let's say "yes"(...) and last but not least it's gonna ask you if you want to style any of the optional

from the tras.js ecosystem.(...) You will have things like "scientos" which is like the "view use" but we're gonna see them in future episodes so for now let's have a clean tras.js project. So let's hit enter and as easy as that it has to strap your first tras.js application.

Once you open it in your editor, just make sure you install all the dependencies and you're gonna realize that these are pretty basic with application using Vue. But the good thing is that it comes out of the box, configuring it with template compiler options that we need for Tres, especially for the language of the custom render API. And it has some optimizations in terms of excluding Vue or Tree from the bundle, etc.

of that, everything is pretty straightforward. You have a source folder with an app.vue. This app.vue is the main point for the Tres Canvas, which is the primary

of Tres.js core. It's the one that is gonna create the canvas for you. And then we have a subcomponent that contains everything of the scene. We are going to see how it works later. But for now, let's just check that it actually runs the server. So I'm gonna open the terminal here, just clear out, and then PMPM run dev.

So if everything works correctly, we should be seeing something like this. A cube rotating on kind of like a teal background.

(Music)

But Alvaro, how do I set up all these 3D stuff with Vue?

(...)

That's a great question, but the good thing is, you actually don't need to.

Let me show you what I mean with that. So let's get back to the app.view on our project and to demonstrate I'm going to remove everything that was as default. So I'm going to remove the Tres Canvas and the experience. So if I hit save we shouldn't be seeing anything in the browser. So the most important component in Tres.js core is the Tres Canvas. This is the one that's going to create the canvas and the render for us.(...) So we use it like this and then let's hit save. Nothing happens. But to note if this is working let's go to our developer tools and actually I'm going to remove this here so we can see it better.

(...)

Inside of the div.app we're going to have a canvas and we know if it's initialized because it should have the data Tres with the version of Tres.js and the engine being 3DS version I don't know the version that you have in that one.

Now, let's see if we can brand new something inside.

(...)

So we are going to go here and just follow me along. Okay, so we are going to close the Tress Canvas.

(...)

And inside of here, we are going to add a Tress Access Helper.(...) This is a small helper that will allow you to see where is the origin of the scene. So if we hit save, we are seeing that we see the object right here.(...) But didn't we mention before that we needed a camera to make it work?

Tress Canvas adds a camera for you by default, so you do not need to worry about it. But if you want to add your own, you can always do it like this.

So the trick here is to prefix everything we trust. So in the case of a perspective camera, we can initialize one like this. And then let's say we want to change the field of view. We now see it in a different fashion. But how does it work?

The core principle of Tres-ES is really straightforward. You can take any instance of 3DS, let's say a perspective camera. You import it like this and then you initialize it with some parameters, let's say the field of view, the aspect radio and so on. Then you need to add it to the scene.

The way you will do it in Tres-ES is the following. You take the template and inside of the Tres canvas you will add a component that is the same name as the instances you want to add, prefix it with the word Tres.(...) That way the custom renderer of Tres will know that this is an instance component.

You can pass the arguments in a similar way by using a special prop called arcs.(...) You will pass an array with the same order of elements that you will have in the constructor.

about adding it into the scene because the custom renderer will handle that for you.

Okay, so the next thing I want to show you guys is actually how to modify the properties of your 3DS objects. So here I have another scene that I added a TresgridHelper component to help us visualize the changes on the camera. And then

(...)

initialize the camera here with the perspective with an argument of Field of View of 75. The Field of View is how much of the scene the camera is able to capture. It has to do with the angle or like the properties of the lens.

(...)

we're going to change the initial value by adding a prop

IntelliSense here is showing us everything that we can use, but we're going to use the prop fub of Field of View. So let's put a really exaggerated value here, so like 25.(...) And now if we hit save, we're going to see that the scene looks really different.

To change the values of the properties of your 3DS objects, you need to do the following. In pure 3DS, what you will do is, let's say we import an ambient light,

(...)

and then we initialize it, and we want to change the color. So we do light.color and we use the set method to set the value.

(...)

Not all the properties have a set value. There are properties like the light.intensity that you can use the value directly.

In 3DS,

You have the trust canvas,(...) you add the component by using the trust prefix,

(...)

map the properties by using view props. In this case, we are setting the color and intensity, and you can notice that I'm not using the set method, because 3DS is going to automatically detect if the properties have a set method or not. So you don't need to worry about it.

You can use View Ractivity here and say something like import the ref from view and then create a variable called Field of View and then just pass it through.(...) So let's put another value, I don't know, like 40.

(...)

And then we have a different Field of View.

We can even do something like this. We can set a timeout and then after two seconds have another value on the scene. So if we refresh,(...) after two seconds, we have a completely more wide view of our scene.

prop is not only for the trust custom render components, you can also do it in the trust canvas.(...) One of the things that you can change is actually the background color. So the initial color that we have was the clear color here and this changed the background scene color.

So you can use props to change the properties of anything in your 3DS scene.

Okay, what if I want to add something like a donut into our scene? There is another API that we can use to create objects.

(...)

So we can use a TresMesh.

(...)

And inside of the TresMesh we can pass a box geometry, but in this case we don't want a box, we want a Taurus geometry.

(...)

And let's see what arguments it accepts.(...) Let's see if we set arcs.

(...)

It's going to take the radius and the longitude of the tube and also the radial segments and the tumbler segments. So we can pass something like this.

(...)

And if we hit save we're going to see geometry, like an object, formed by a Taurus geometry. Don't ask me why it's called Taurus.

(...)

In my opinion it should be a donut geometry.

(...)

And then it comes with Adeform material, which is a basic material on white. But we can also pass via a slot the TresMesh normal material. So if we hit save here, now we have a different material on our donut.

Another API that is available for you to create your objects in 3DS is the ViewSlot API.

(...)

So let's say we want to create a donut. The way you would do it normally in 3DS is that you import a mesh and you initialize it with some properties. The first one, or the first argument, is the geometry. It's the shape that you want to create. In this case, the donut is actually called torus and you pass some arguments.

(...)

Along with that, you can pass also a material, which is all the visual properties that we will have, like the color, the opacity, the roughness, etc.

(...)

So after that, you will add all the donuts into the scene by using the sceneAddDonut.(...) The way you would do it in 3DS is that inside of the 3DS canvas,(...) you will add a 3ds mesh component and via slot, you are going to add a 3ds towards geometry with the arguments, similar to what we did before.

(...)

And then you can pass another component called the trasmesh_normal_material.

Of course this is not the only way to do it, but it's the declarative way. If you want to do something more programmatically,(...) you can remove the slots here, okay? And go into the script tag and say import...

(...)

Let's import the torus geometry.

(...)

Actually from tree, not from tree standard library. And we're gonna use the mesh normal material here.

(...)

And then we're gonna say geometry is equal to the torus geometry and material is equal to the new mesh normal material.(...) So once we have that, we can pass it also as props here. So we can pass the geometry and the material to our Tres mesh and it's gonna be exactly the same result.

(...)

So guys, if you made it to this part of the video, it means that you're part of the 20% of people that watch it all the way through, because statistically speaking, only around 15 and 20% of people actually finish YouTube videos. So if you made it this far, please comment in the section below that you're part of the 20% and I would love to connect with you.

The reason why I'm creating these videos and also why I created Tres is to make it easy for people to start in the 3D world. Because frankly, when I started my journey, it was quite a learning curve.(...) So hopefully, these videos and also libraries like Tres.js or other custom renders like ReactorFiber or Tretle will help you get started with your favorite framework.

So if this video helped you and somehow, please let me know in the comments below and show me your creations with Tres.