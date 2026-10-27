// Original composition: Banho de Bossa. Render with the Cadência libraries.
#include "storage/project.h"
#include "audio/export.h"
#include "midi/midi.h"
#include <QCoreApplication>
#include <iostream>
using namespace cadencia;
int main(int argc,char**argv){QCoreApplication app(argc,argv);try{
 Composition c;c.title="Banho de Bossa · Pet Shop";c.bpm=80;c.bars=20;
 Track guitar,bass,melody,drums;guitar.name="Violão de nylon";guitar.program=24;guitar.volume=68;guitar.pan=-18;guitar.polyphonic=true;
 bass.name="Contrabaixo suave";bass.program=32;bass.volume=57;
 melody.name="Piano elétrico · carinho";melody.program=4;melody.volume=48;melody.pan=15;
 drums.name="Percussão de bossa";drums.drums=true;drums.bank=128;drums.volume=39;drums.polyphonic=true;
 int chords[20][4]={{60,64,67,71},{59,62,66,69},{59,62,64,68},{60,64,67,71},{57,60,64,67},{57,60,62,66},{55,59,62,66},{55,59,61,65},{57,60,64,67},{57,60,62,66},{55,59,62,65},{55,58,61,64},{60,64,67,71},{59,62,64,68},{57,60,64,67},{57,60,62,66},{57,60,64,67},{57,60,63,66},{60,64,67,71},{59,62,65,69}};
 int roots[]={36,35,40,45,38,43,36,45,38,43,36,36,41,40,38,43,41,34,36,43};
 int tune[20][4]={{76,79,83,79},{78,74,73,74},{76,80,83,80},{79,76,72,71},{72,76,79,76},{78,76,74,69},{71,74,78,74},{73,77,76,73},{72,76,79,81},{78,74,71,69},{71,74,77,74},{76,73,70,67},{76,79,81,79},{80,76,74,71},{72,76,79,76},{78,76,74,71},{76,79,81,79},{78,75,72,69},{76,79,76,74},{74,71,69,71}};
 EventId id=1;auto note=[&](Track&t,int pitch,Tick when,Tick dur,int vel){t.notes.push_back({id++,when,dur,pitchFromMidi(pitch),vel,{}});};
 for(int b=0;b<20;b++){Tick start=b*3840;
  int rhythm[]={0,720,1680,2400,3120};
  for(int k=0;k<5;k++)for(int n=0;n<4;n++)note(guitar,chords[b][n],start+rhythm[k]+n*10,420,k%2?49:57);
  note(bass,roots[b],start,1440,64);note(bass,roots[b]+7,start+1920,1290,56);
  for(int k=0;k<4;k++)if(!(b%4==3&&k==3))note(melody,tune[b][k],start+240+k*960,k==3?600:720,52+(k%2)*4);
  for(int k=0;k<8;k++)note(drums,42,start+k*480,120,k%2?28:36);
  for(int k: {0,1920})note(drums,36,start+k,180,42);
  for(int k: {960,2640})note(drums,37,start+k,120,48);
  for(int k: {1440,3360})note(drums,69,start+k,120,28);
 }
 c.tracks={guitar,bass,melody,drums};validate(c);saveProject(c,"music/petshop/banho-de-bossa.cadencia");midi::write("music/petshop/banho-de-bossa.mid",midi::encode(c,1,false));
 // Three cycles allow the middle cycle to retain the preceding release tails.
 for(auto &t:c.tracks){auto notes=t.notes;for(int cycle=1;cycle<3;cycle++)for(auto n:notes){n.id=id++;n.onset+=cycle*20*3840;t.notes.push_back(n);}}c.bars=60;
 audio::Renderer loader;auto bank=loader.loadBank("/usr/share/cadencia/soundfonts/TimGM6mb.sf2",initialSoundFontId);
 auto r=audio::exportAudio(c,{bank},"/tmp/petshop-bossa-three-cycles.wav",{audio::ExportFormat::Wav,192});std::cout<<r.seconds<<" seconds, clipped="<<r.clippedSamples<<"\n";
 }catch(const std::exception&e){std::cerr<<e.what();return 1;}}
