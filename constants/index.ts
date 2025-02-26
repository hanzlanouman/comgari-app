import { BaseUrl, environment } from "@/common/enviornment";
import onboarding1 from "@/assets/images/onboarding1.jpg";
import onboarding2 from "@/assets/images/onboarding2.jpg";
import onboarding3 from "@/assets/images/onboarding3.jpg";
// import { environment } from "@/common/enviornment";
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

import missingImage from "@/assets/images/missing-image.jpg";

import check from "@/assets/images/check.png";

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
  missingImage,
  check
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
    title: "Ready to Work With You",
    description:
      "Stay organized and become productive with Comgari. It helps arrange your tasks and monitor them to ensure timely meeting of deadlines, whether you work alone or in a team.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "Ready to Work With You",
    description:
      "Comgari is all set to retain a proper tracking and progress record as well as great communication features to keep your team on the same page.",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "Ready to Work With You",
    description:
      "Comgari will make task management simple with real-time updates and easy-to-use features. The road to your success has always been paved, whether you are a team manager or a part of a team.",
    image: images.onboarding3,
  },
];

export const UNITS = {
  CURRENCY: '$',
}

export const data = {
  onboarding,
};

export const STRIPE_PUBLIC_KEY =
  "pk_test_51QQYK5G8sQYF8V0vXjymMsGlVSlVZN9kNDoQmeeBu3OsR3TD4KS1MCQ2JUTKoVtKcdQ0hm0ec0dTdrSb0YzabtQ5009pBAjnaP";

export const getImageUrl = (url: string) => {
  if (environment === "development") {
    return `${BaseUrl}:3010/public/${url}`;
  } else {
    return `${BaseUrl}/public/${url}`;
  }
};
