// Original composition: Banho de Bossa. Render with the Cadência libraries.
#include "storage/project.h"
#include "audio/export.h"
#include "midi/midi.h"
#include <QCoreApplication>
#include <iostream>
using namespace cadencia;
int main(int argc,char**argv){QCoreApplication app(argc,argv);try{
 Composition c;c.title="Jardim das Lembranças · verso, refrão, ponte e outro";c.bpm=64;c.bars=24;
 Track piano,pad,bell,flute;
 piano.name="Piano elétrico · passos suaves";piano.program=4;piano.volume=62;piano.pan=-15;piano.polyphonic=true;
 pad.name="Cordas · nuvens";pad.program=48;pad.volume=27;pad.pan=-5;pad.polyphonic=true;
 bell.name="Vibrafone · pequenas lembranças";bell.program=11;bell.volume=39;bell.pan=22;
 flute.name="Flauta · tema do refrão";flute.program=73;flute.volume=43;flute.pan=8;
 int chords[24][4]={{60,64,67,71},{59,62,67,69},{57,60,64,67},{57,60,64,65},{57,60,62,65},{55,59,62,65},{60,64,67,71},{59,62,65,69},
 {57,60,64,67},{59,62,67,69},{60,64,67,71},{57,60,64,67},{57,60,62,65},{55,59,62,65},{60,64,67,71},{59,62,65,69},
 {56,60,63,67},{58,62,65,69},{55,59,62,65},{60,64,67,71},
 {57,60,64,65},{57,60,62,65},{60,64,67,71},{59,62,65,69}};
 int roots[]={48,43,45,41,38,43,48,43,41,43,48,45,38,43,48,43,44,46,43,48,41,38,48,43};
 int theme[24][4]={{76,79,74,0},{74,71,69,0},{72,76,79,0},{77,76,72,0},{74,77,76,0},{74,71,69,0},{76,79,83,79},{74,71,0,0},
 {81,79,76,79},{79,74,71,74},{79,83,81,79},{76,79,72,0},{77,81,79,77},{74,77,76,74},{76,79,83,79},{74,71,69,0},
 {75,79,72,0},{77,81,74,0},{74,71,69,0},{76,79,72,0},
 {77,76,72,0},{74,77,69,0},{76,74,72,0},{71,74,71,0}};
 EventId id=1;auto note=[&](Track&t,int pitch,Tick onset,Tick duration,int velocity){t.notes.push_back({id++,onset,duration,pitchFromMidi(pitch),velocity,{}});};
 for(int b=0;b<24;b++){Tick start=b*3840;bool chorus=b>=8&&b<16,bridge=b>=16&&b<20,outro=b>=20;
  note(piano,roots[b],start,2880,bridge?36:44);
  for(int k=0;k<4;k++)note(piano,chords[b][k],start+240+k*720,bridge?720:960,chorus?49:40);
  for(int k=0;k<4;k++)note(pad,chords[b][k]-12,start,3600,bridge?31:25);
  for(int k=0;k<4;k++)if(theme[b][k])note(chorus?flute:bell,theme[b][k],start+480+k*840,k==3?720:780,(chorus?55:44)-(outro?6:0));
  if(chorus&&b%2==0)note(bell,chords[b][2]+12,start+3000,720,32);
 }
 c.tracks={piano,pad,bell,flute};validate(c);saveProject(c,"music/memory/jardim-das-lembrancas.cadencia");midi::write("music/memory/jardim-das-lembrancas.mid",midi::encode(c,1,false));
 // Three cycles allow the middle cycle to retain the preceding release tails.
 for(auto &t:c.tracks){auto notes=t.notes;for(int cycle=1;cycle<3;cycle++)for(auto n:notes){n.id=id++;n.onset+=cycle*24*3840;t.notes.push_back(n);}}c.bars=72;
 audio::Renderer loader;auto bank=loader.loadBank("/usr/share/cadencia/soundfonts/TimGM6mb.sf2",initialSoundFontId);
 auto r=audio::exportAudio(c,{bank},"/tmp/memory-three-cycles.wav",{audio::ExportFormat::Wav,192});std::cout<<r.seconds<<" seconds, clipped="<<r.clippedSamples<<"\n";
 }catch(const std::exception&e){std::cerr<<e.what();return 1;}}
