// Original composition: Banho de Bossa. Render with the Cadência libraries.
#include "storage/project.h"
#include "audio/export.h"
#include "midi/midi.h"
#include <QCoreApplication>
#include <iostream>
using namespace cadencia;
int main(int argc,char**argv){QCoreApplication app(argc,argv);try{
 Composition c;c.title="Banho de Bossa · verso, refrão, ponte e outro";c.bpm=80;c.bars=20;
 Track guitar,bass,melody,drums,flute,vibes;guitar.name="Violão de nylon";guitar.program=24;guitar.volume=68;guitar.pan=-18;guitar.polyphonic=true;
 bass.name="Contrabaixo suave";bass.program=32;bass.volume=57;
 melody.name="Piano elétrico · carinho";melody.program=4;melody.volume=48;melody.pan=15;
 drums.name="Percussão de bossa";drums.drums=true;drums.bank=128;drums.volume=39;drums.polyphonic=true;
 // 6 bars verse, 6 chorus, 4 bridge, 4 outro. 20 x 3 seconds = 60 seconds.
 int chords[20][4]={
 {59,62,64,67},{57,60,64,67},{57,60,64,65},{59,62,65,69},{59,62,64,67},{58,61,64,67},
 {57,60,64,67},{56,60,63,67},{55,59,62,66},{55,58,61,64},{57,60,64,65},{59,62,65,69},
 {56,60,63,67},{55,58,62,65},{55,58,60,64},{57,60,64,67},
 {57,60,64,65},{59,62,65,69},{59,62,64,67},{59,62,65,68}};
 int roots[]={36,45,38,43,36,36,41,41,40,45,38,43,44,38,43,36,38,43,36,43};
 // Motifs have rests, pickups and unequal durations, rather than quarter-note runs.
 int tune[20][5]={
 {76,79,74,76,0},{72,76,79,76,0},{77,76,72,69,0},{74,77,76,74,71},{76,79,83,79,76},{76,73,70,67,0},
 {81,79,76,79,81},{79,77,75,72,0},{79,78,74,71,74},{76,73,70,69,0},{77,76,72,76,77},{74,77,81,79,0},
 {75,79,72,0,0},{74,77,70,0,0},{76,74,70,67,0},{76,79,72,0,0},
 {77,76,72,69,0},{74,77,76,71,0},{76,74,72,0,0},{71,74,68,71,0}};
 flute.name="Flauta · refrão e resposta";flute.program=73;flute.volume=48;flute.pan=10;
 vibes.name="Vibrafone · brilhos";vibes.program=11;vibes.volume=34;vibes.pan=26;
 EventId id=1;auto note=[&](Track&t,int pitch,Tick when,Tick dur,int vel){t.notes.push_back({id++,when,dur,pitchFromMidi(pitch),vel,{}});};
 for(int b=0;b<20;b++){Tick start=b*3840;bool chorus=b>=6&&b<12,bridge=b>=12&&b<16,outro=b>=16;
  const int rhythmA[]={0,720,1680,2400,3120},rhythmB[]={0,1440,2160,3360};
  int hits=bridge?3:(b%2?4:5);
  for(int k=0;k<hits;k++)for(int n=0;n<4;n++){
   int offset=bridge?k*1200:(b%2?rhythmB[k]:rhythmA[k]);
   note(guitar,chords[b][n],start+offset+n*10,bridge?600:330, (chorus?57:49)+(k%2?0:5)-(outro?4:0));
  }
  note(bass,roots[b],start,bridge?2280:1440,chorus?65:57);
  if(!bridge)note(bass,roots[b]+7,start+1920,1080,51);
  if((b%2==1)&&b!=19)note(bass,roots[b+1]+(roots[b+1]>roots[b]? -1:1),start+3360,360,43);
  const int onset[]={240,960,1680,2640,3360},duration[]={600,480,720,600,360};
  for(int k=0;k<5;k++)if(tune[b][k]){
   Track &lead=chorus?flute:melody;
   note(lead,tune[b][k],start+onset[k],bridge&&k==2&&!tune[b][3]?1440:duration[k],(chorus?62:56)-(k%2?6:0)-(outro?5:0));
  }
  // Gentle answering figures and a returning hook at the end of the bridge.
  if(b==3||b==9||b==15){note(vibes,chords[b][1]+12,start+2880,360,48);note(vibes,chords[b][2]+12,start+3360,360,42);}
  if(chorus){note(melody,chords[b][0]+12,start+480,720,37);note(melody,chords[b][2]+12,start+2160,960,34);}
  if(b==18)note(vibes,84,start+1920,1440,38);
  for(int k=0;k<8;k++)if(!bridge||k%2==0)note(drums,42,start+k*480,120,(k%2?24:31)+(chorus?4:0));
  if(!bridge){for(int k: {0,1920})note(drums,36,start+k,180,chorus?42:35);}
  for(int k: {960,2640})if(!bridge||k==2640)note(drums,37,start+k,120,chorus?46:33);
  if(chorus)for(int k: {1440,3360})note(drums,69,start+k,120,28);
  if(b==5||b==11){note(drums,64,start+3120,120,37);note(drums,63,start+3480,120,32);}
 }
 c.tracks={guitar,bass,melody,flute,vibes,drums};validate(c);saveProject(c,"music/petshop/banho-de-bossa.cadencia");midi::write("music/petshop/banho-de-bossa.mid",midi::encode(c,1,false));
 // Three cycles allow the middle cycle to retain the preceding release tails.
 for(auto &t:c.tracks){auto notes=t.notes;for(int cycle=1;cycle<3;cycle++)for(auto n:notes){n.id=id++;n.onset+=cycle*20*3840;t.notes.push_back(n);}}c.bars=60;
 audio::Renderer loader;auto bank=loader.loadBank("/usr/share/cadencia/soundfonts/TimGM6mb.sf2",initialSoundFontId);
 auto r=audio::exportAudio(c,{bank},"/tmp/petshop-bossa-three-cycles.wav",{audio::ExportFormat::Wav,192});std::cout<<r.seconds<<" seconds, clipped="<<r.clippedSamples<<"\n";
 }catch(const std::exception&e){std::cerr<<e.what();return 1;}}
