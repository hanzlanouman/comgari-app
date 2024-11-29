import { BaseUrl } from "@/common/enviornment";
import onboarding1 from "@/assets/images/onboarding1.jpg";
import onboarding2 from "@/assets/images/onboarding2.jpg";
import onboarding3 from "@/assets/images/onboarding3.jpg";
import { environment } from "@/common/enviornment";
import welcome from "@/assets/images/welcome.jpg";
import logo from "@/assets/images/logo.png";
import login from "@/assets/images/login.jpg";
import donat from "@/assets/images/donat.png";
import card from "@/assets/images/card.png";
import masterCard from "@/assets/images/master-card.png";
import visa from "@/assets/images/visa.png";
import member from "@/assets/images/member.png";
import user from "@/assets/images/user.jpg";
import pdf from "@/assets/images/pdf.png";
import doc from "@/assets/images/doc.png";
import invoice from "@/assets/images/invoice.png";

import brief from "@/assets/icons/brief.png";
import tasks from "@/assets/icons/tasks.png";
import notes from "@/assets/icons/notes.png";
import media from "@/assets/icons/media.png";
import noTask from "@/assets/icons/no-task.png";
import video from "@/assets/icons/video.png";
import noNotes from "@/assets/icons/no-notes.png";
import pdfIcon from "@/assets/icons/pdf-icon.png";
import docIcon from "@/assets/icons/doc-icon.png";

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  welcome,
  logo,
  login,
  donat,
  card,
  masterCard,
  visa,
  member,
  user,
  pdf,
  doc,
  invoice,
};

export const icons = {
  brief,
  tasks,
  notes,
  media,
  noTask,
  noNotes,
  video,
  pdfIcon,
  docIcon,
};

export const onboarding = [
  {
    id: 1,
    title: "We are ready to work with you!",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "We are ready to work with you!",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "We are ready to work with you!",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    image: images.onboarding3,
  },
];

export const data = {
  onboarding,
};

export const STRIPE_PUBLIC_KEY =
  "pk_test_51QHkbfJ8znQx7EOtvChenybm3ZwHYKH7X2qAM8FkSKbvgiWrUDnXFH9ssayz0GvYbBFQKSxbsPd7QBuuxiYzNdcX0043g3oki9";

// export const getImageUrl = (filename: string | null | undefined): string => {
//   if (!filename) return ''; 
//   return `${BaseUrl}:3010/public/${filename}`;
// };

export const getImageUrl = (url) => {
  if (environment === "development") {
    console.log("image",`${BaseUrl}:3010/public/${url}`)
    return `${BaseUrl}:3010/public/${url}`;
  } else {
    return `${BaseUrl}/public/${url}`;
  }
};