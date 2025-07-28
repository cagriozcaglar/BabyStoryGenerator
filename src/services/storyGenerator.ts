import { StoryParams } from '../components/StoryForm';

export class StoryGenerator {
  private templates = {
    adventure: [
      "Once upon a time, in a magical {setting}, there lived a little {character1} named {character1Name}.",
      "One {feeling} morning, {babyName} and {character1Name} decided to go on an adventure.",
      "They met {character2Name} the {character2} who was {character2Action}.",
      "Together, they discovered {discovery} and learned about {lesson}.",
      "With {character3Name} the {character3} joining them, they had the most wonderful time.",
      "At the end of their adventure, {babyName} felt so {feeling} and proud.",
      "They all became the best of friends and promised to have more adventures together.",
      "And {babyName} fell asleep with a big smile, dreaming of tomorrow's fun."
    ],
    friendship: [
      "In a cozy {setting}, {babyName} met a sweet {character1} named {character1Name}.",
      "At first, {babyName} was a little shy, but {character1Name} was so {feeling} and welcoming.",
      "{character1Name} showed {babyName} how to {friendlyAction}.",
      "Soon, {character2Name} the {character2} came to play too.",
      "They all learned that {lesson} makes friendships even stronger.",
      "When {character3Name} the {character3} felt sad, they all worked together to help.",
      "{babyName} discovered that having friends makes everything more {feeling}.",
      "That night, {babyName} hugged their new friends and felt so loved."
    ],
    learning: [
      "{babyName} was a very {feeling} little one who loved to explore.",
      "In the beautiful {setting}, there was so much to discover!",
      "{character1Name} the {character1} taught {babyName} about {learningTopic}.",
      "Then {character2Name} the {character2} showed them {skill}.",
      "{character3Name} the {character3} helped {babyName} practice being {lesson}.",
      "Every day brought new things to learn and explore.",
      "{babyName} grew {feeling} and {lesson} with each new experience.",
      "At bedtime, {babyName} was proud of all they had learned that day."
    ]
  };

  private characterActions = {
    adventure: ["playing in the sunshine", "collecting colorful flowers", "singing beautiful songs", "building sandcastles", "chasing butterflies"],
    friendship: ["share toys", "sing together", "dance", "paint pictures", "read books"],
    learning: ["colors and shapes", "numbers and letters", "animal sounds", "how to be kind", "sharing and caring"]
  };

  private discoveries = {
    forest: ["a hidden waterfall", "a family of friendly deer", "rainbow-colored mushrooms", "singing birds"],
    ocean: ["sparkling seashells", "dancing dolphins", "a magical coral garden", "gentle sea turtles"],
    garden: ["buzzing bees making honey", "butterflies dancing", "growing vegetables", "singing flowers"],
    castle: ["a room full of books", "friendly dragons", "magical paintings", "treasure chests"],
    farm: ["baby animals playing", "fresh strawberries", "a kind farmer", "golden wheat fields"],
    space: ["twinkling stars", "friendly planets", "shooting stars", "moon rabbits"],
    home: ["cozy reading nooks", "warm cookies", "family photos", "soft blankets"]
  };

  generateStory(params: StoryParams): string {
    const template = this.templates[params.theme as keyof typeof this.templates] || this.templates.adventure;
    const characterNames = this.generateCharacterNames(params.characters);
    
    let story = template.map(sentence => {
      return this.replacePlaceholders(sentence, params, characterNames);
    }).join(' ');

    return this.formatStory(story);
  }

  private generateCharacterNames(characters: string[]): { [key: string]: string } {
    const names = {
      Bunny: ['Fluffy', 'Cotton', 'Whiskers', 'Snowy'],
      Bear: ['Honey', 'Teddy', 'Cocoa', 'Maple'],
      Cat: ['Whiskers', 'Luna', 'Shadow', 'Mittens'],
      Dog: ['Buddy', 'Sunny', 'Chase', 'Ruby'],
      Elephant: ['Ella', 'Peanut', 'Dumbo', 'Grace'],
      Lion: ['Leo', 'Sunny', 'Royal', 'Brave'],
      Monkey: ['Mango', 'Zippy', 'Banana', 'Swing'],
      Owl: ['Hoot', 'Wise', 'Olive', 'Luna'],
      Fox: ['Rusty', 'Clever', 'Amber', 'Swift'],
      Penguin: ['Waddle', 'Ice', 'Splash', 'Frost']
    };

    const result: { [key: string]: string } = {};
    characters.forEach((character, index) => {
      const characterNames = names[character as keyof typeof names] || ['Friend'];
      result[`character${index + 1}Name`] = characterNames[Math.floor(Math.random() * characterNames.length)];
      result[`character${index + 1}`] = character.toLowerCase();
    });

    return result;
  }

  private replacePlaceholders(sentence: string, params: StoryParams, characterNames: { [key: string]: string }): string {
    let result = sentence;
    
    // Replace basic parameters
    result = result.replace(/{babyName}/g, params.babyName);
    result = result.replace(/{setting}/g, params.setting);
    result = result.replace(/{feeling}/g, params.feeling);
    result = result.replace(/{lesson}/g, params.lesson);
    result = result.replace(/{theme}/g, params.theme);

    // Replace character names and types
    Object.keys(characterNames).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      result = result.replace(regex, characterNames[key]);
    });

    // Replace dynamic content
    result = result.replace(/{character2Action}/g, this.getRandomItem(this.characterActions[params.theme as keyof typeof this.characterActions] || this.characterActions.adventure));
    result = result.replace(/{discovery}/g, this.getRandomItem(this.discoveries[params.setting as keyof typeof this.discoveries] || this.discoveries.forest));
    result = result.replace(/{friendlyAction}/g, this.getRandomItem(this.characterActions.friendship));
    result = result.replace(/{learningTopic}/g, this.getRandomItem(this.characterActions.learning));
    result = result.replace(/{skill}/g, 'how to be gentle and kind');

    return result;
  }

  private getRandomItem(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  private formatStory(story: string): string {
    // Split into paragraphs and add proper formatting
    const sentences = story.split('. ');
    const paragraphs: string[] = [];
    
    let currentParagraph = '';
    sentences.forEach((sentence, index) => {
      if (currentParagraph === '') {
        currentParagraph = sentence + (index < sentences.length - 1 ? '. ' : '');
      } else if (currentParagraph.split('. ').length >= 2) {
        paragraphs.push(currentParagraph);
        currentParagraph = sentence + (index < sentences.length - 1 ? '. ' : '');
      } else {
        currentParagraph += sentence + (index < sentences.length - 1 ? '. ' : '');
      }
    });
    
    if (currentParagraph) {
      paragraphs.push(currentParagraph);
    }

    return paragraphs.join('\n\n');
  }
}

export const storyGenerator = new StoryGenerator();