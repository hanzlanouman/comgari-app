
export type TClient = {
    id: number;
    name: string;
    image?: string;
    category: string;
    status: string;
    description: string;
    progress: number;
    dueDate: string;
    members: Array<{
      id: number;
      image: string;
      name: string;
    }>;
  };

