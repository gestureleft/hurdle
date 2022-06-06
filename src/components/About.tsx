import { Component, Show } from "solid-js";
import about from "./About.module.css";
import { IoClose } from "solid-icons/io";
import { BsGithub } from "solid-icons/bs";

type AboutProps = {
  close: (e: MouseEvent) => unknown | undefined;
};

const About: Component<AboutProps> = (props) => {
  return (
    <div class={about.root}>
      <div>
        <div class={about.headerRow}>
          <h2>Wordle Clone</h2>
          <Show when={props.close !== undefined}>
            <button class={about.closeButton} onClick={props.close}>
              <IoClose size={26} color="white" />
            </button>
          </Show>
        </div>
        This is a clone of Wordle created by Harrison Marshall with SolidJS for
        fun.
      </div>
      <div class={about.linkRow}>
        <a
          target="_blank"
          class={about.link}
          href="https://github.com/gestureleft/hurdle"
        >
          <div class={about.linkContent}>
            GitHub Project
            <BsGithub size={24} color="white" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default About;
