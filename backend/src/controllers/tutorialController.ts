import { Request, Response } from 'express';

export const TUTORIAL_DATA = [
  {
    id: 'tut-cwh-python',
    title: 'Python for Beginners (Full Course #100DaysOfCode)',
    description: 'Master Python programming from zero to advanced with CodeWithHarry. Covers core data structures, OOPs, modules, automation, and real-world project development.',
    category: 'Core Programming',
    durationMinutes: '100+ Videos',
    videoUrl: 'https://www.youtube-nocookie.com/embed/videoseries?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg',
    externalUrl: 'https://youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt242xIpHhPT2llg&si=82RHskftZhCeUxxa',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
    instructor: 'CodeWithHarry (Harry)',
    difficulty: 'Beginner',
    keyTakeaways: [
      'Comprehensive Python fundamentals, control flow, functions & packages.',
      'Hands-on object-oriented programming (OOP), file I/O & exception handling.',
      'Building portfolio projects and automating scripts to prove skills.',
    ],
    actionLink: {
      label: 'Update Python in Skills',
      page: 'network',
    },
    isCompleted: false,
  },
  {
    id: 'tut-cw-cpp',
    title: 'C++ in One Shot | Complete Programming Tutorial for Beginners',
    description: 'Comprehensive end-to-end C++ masterclass by College Wallah. Covers syntax, conditional statements, loops, pattern printing, pointers, recursion, and arrays.',
    category: 'Core Programming',
    durationMinutes: 120,
    videoUrl: 'https://www.youtube-nocookie.com/embed/e7sAf4SbS_g',
    externalUrl: 'https://youtu.be/e7sAf4SbS_g?si=txne4EVLvzSRlNhH',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    instructor: 'College Wallah (PW Skills)',
    difficulty: 'Intermediate',
    keyTakeaways: [
      'Master C++ core syntax, pointers, memory references, and recursion.',
      'Solve pattern printing, multidimensional arrays, and string algorithms.',
      'Prepare fundamental DSA concepts tested in top engineering interviews.',
    ],
    actionLink: {
      label: 'Practice Mock Interview',
      page: 'mock-interview',
    },
    isCompleted: false,
  },
];

export const getTutorials = async (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: TUTORIAL_DATA,
    count: TUTORIAL_DATA.length,
  });
};

export const completeTutorial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tutorial = TUTORIAL_DATA.find((t) => t.id === id);
  if (!tutorial) {
    return res.status(404).json({ success: false, message: 'Tutorial not found' });
  }
  tutorial.isCompleted = true;
  return res.json({
    success: true,
    message: 'Tutorial marked as completed',
    tutorial,
  });
};
