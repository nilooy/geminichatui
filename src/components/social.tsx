import React from "react";
import { Icon } from "@/components/ui/icons";

const Social = () => {
  return (
    <div className="fixed top-2 right-2">
      <div className="flex gap-2 items-center font-black">
        <span>Made with ❤️ by</span>
        <a href="https://twitter.com/nil_ooy" target="_blank" rel="noreferrer">
          <Icon
            icon="akar-icons:twitter-fill"
            className="text-xl text-[#1DA1F2]"
          />
        </a>
        <a
          href="https://github.com/nilooy/geminichatui"
          target="_blank"
          rel="noreferrer"
        >
          <Icon icon="akar-icons:github-fill" className="text-lg" />
        </a>
      </div>
    </div>
  );
};

export default Social;
